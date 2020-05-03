import React, { useState, useEffect, Suspense } from 'react';
import { Question } from '../../api/classes/question.class';
import { Game } from '../../api/classes/game.class';

export type TemplateDisplayProps = {
  playingGame: Game;
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
  errorMessage?: string;
};

const TemplateDisplayLoaderComponent: React.FunctionComponent<Props> = (
  props: Props
) => {
  const [message, setMessage] = useState('Loading...');
  const [LazyComponent, setLazyComponent] = useState<any>(undefined);

  useEffect(() => {
    setLazyComponent(
      React.lazy(() =>
        import(`./${props.templatePath}/display`).catch((e) => {
          setMessage(props.errorMessage || e.message);
        })
      )
    );
  }, [props.templatePath]);

  return (
    <Suspense fallback={<div>{message}</div>}>
      {LazyComponent && (
        <LazyComponent
          {...props.displayProps}
          {...props.displayProps.otherProps}
        />
      )}
    </Suspense>
  );
};

export const TemplateDisplayLoader = TemplateDisplayLoaderComponent;
