import React from 'react';
import { TemplateDisplayProps } from '../templateDisplay';
interface OwnProps {}

type Props = OwnProps & TemplateDisplayProps;

const SimpleQuestionTemplate: React.FunctionComponent<Props> = (
  props: Props
) => {
  return <div>Test</div>;
};

export default SimpleQuestionTemplate;
