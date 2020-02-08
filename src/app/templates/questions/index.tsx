import React, { useState, useEffect } from 'react';

interface OwnProps {
  templatePath: string;
  templateProps: any;
}

type Props = OwnProps;

const TemplateLoader: React.FunctionComponent<Props> = (props: Props) => {
  const [LoadedComponent, setComponent] = useState();
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    setMessage('Loading...');
    import(`./${props.templatePath}/index`)
      .then(v => {
        setComponent(v.default);
      })
      .catch(e => {
        setComponent(null);
        setMessage(e.message);
      });
  }, [props.templatePath]);

  return LoadedComponent ? (
    <LoadedComponent {...props.templateProps} />
  ) : (
    <>{message}</>
  );
};

export default TemplateLoader;

export const templateList: string[] = ['simple', 'test'];
