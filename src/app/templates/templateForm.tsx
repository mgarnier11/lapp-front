import React, { useState, useEffect, Suspense } from 'react';
import { Question } from '../../api/classes/question.class';
import { QuestionType } from '../../api/classes/questionType.class';

export type TemplateFormProps = {
  question: Question;
  editable: boolean;
  disabled?: boolean;
  displayExtraInfos?: boolean;
  displayText?: boolean;
  dateOptions?: Intl.DateTimeFormatOptions;
  formProps: QuestionFormProps;
  otherProps?: any;
};

export type QuestionFormProps = {
  text: string;
  setText: (value: string) => void;
  difficulty: number;
  setDifficulty: (value: number) => void;
  hotLevel: number;
  setHotLevel: (value: number) => void;
};

type Props = {
  templatePath: string;
  formProps: TemplateFormProps;
  errorMessage?: string;
};

const TemplateFormLoaderComponent: React.FunctionComponent<Props> = (
  props: Props
) => {
  const [message, setMessage] = useState('Loading...');
  const [LazyComponent, setLazyComponent] = useState<any>(undefined);

  useEffect(() => {
    setLazyComponent(
      React.lazy(() =>
        import(`./${props.templatePath}/form`).catch((e) => {
          setMessage(props.errorMessage || e.message);
        })
      )
    );
  }, [props.templatePath]);

  return (
    <Suspense fallback={<div>{message}</div>}>
      {LazyComponent && (
        <LazyComponent {...props.formProps} {...props.formProps.otherProps} />
      )}
    </Suspense>
  );
};

export const TemplateFormLoader = TemplateFormLoaderComponent;
