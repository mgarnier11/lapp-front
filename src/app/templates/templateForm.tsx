import React, { useState, useEffect } from 'react';
import { Question } from '../../api/classes/question.class';

export type TemplateFormProps = {
  question: Question;
  acceptButtonText?: string;
  denyButtonText?: string;
  onAccept?: (question: Question) => void;
  onDeny?: (question: Question) => void;
  otherProps?: any;
};

type Props = {
  templatePath: string;
  formProps: TemplateFormProps;
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
        setMessage(e.message);
      });
  }, [props.templatePath]);

  return LoadedComponent ? (
    <LoadedComponent {...props.formProps} {...props.formProps.otherProps} />
  ) : (
    <>{message}</>
  );
};

export const TemplateFormLoader = TemplateFormLoaderComponent;
