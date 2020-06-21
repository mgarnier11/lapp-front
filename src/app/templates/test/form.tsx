import React from 'react';
// import { makeStyles } from '@material-ui/core';

import { TemplateFormProps } from '../templateForm';

// const useStyles = makeStyles(theme => ({
//   ratingsGrid: {
//     width: 'calc(100% + 16px)',
//     marginLeft: -8,
//     textAlign: 'center'
//   },
//   hotLevelRating: {
//     color: '#FD6C9E'
//   }
// }));

interface OtherProps {}

type Props = OtherProps & TemplateFormProps;

const SimpleQuestionTemplate: React.FunctionComponent<Props> = (
  props: Props
) => {
  //const classes = useStyles();

  return <>This is a test</>;
};

export default SimpleQuestionTemplate;
