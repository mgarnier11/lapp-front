import React, { useState, useEffect } from 'react';
import { Question } from '../../api/classes/question.class';

export type TemplateDisplayProps = {
  question: Question;
  acceptButtonText?: string;
  denyButtonText?: string;
  onAccept?: (question: Question) => void;
  onDeny?: (question: Question) => void;
  otherProps?: any;
};

type Props = {
  templatePath: string;
  displayProps: TemplateDisplayProps;
};

const TemplateDisplayLoaderComponent: React.FunctionComponent<Props> = (
  props: Props
) => {
  const [LoadedComponent, setComponent] = useState();
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    setMessage('Loading...');
    import(`./${props.templatePath}/display`)
      .then(v => {
        setComponent(v.default);
      })
      .catch(e => {
        setComponent(null);
        setMessage(e.message);
      });
  }, [props.templatePath]);

  return LoadedComponent ? (
    <LoadedComponent
      {...props.displayProps}
      {...props.displayProps.otherProps}
    />
  ) : (
    <>{message}</>
  );
};

export const TemplateDisplayLoader = TemplateDisplayLoaderComponent;
