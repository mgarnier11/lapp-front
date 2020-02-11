import React, { useState, useEffect } from 'react';
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
  errorMessage: string;
};

const TemplateFormLoaderComponent: React.FunctionComponent<Props> = (
  props: Props
) => {
  const [LoadedComponent, setComponent] = useState();
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    setMessage('Loading...');
    import(`./${props.templatePath}/form`)
      .then(v => {
        setComponent(v.default);
      })
      .catch(e => {
        setComponent(null);
        console.log(e);

        setMessage(props.errorMessage);
      });
  }, [props.templatePath]);

  return LoadedComponent ? (
    <LoadedComponent {...props.formProps} {...props.formProps.otherProps} />
  ) : (
    <>{message}</>
  );
};

export const TemplateFormLoader = TemplateFormLoaderComponent;
