import React from 'react';
import { Container, Card, CardContent, CardHeader } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Question } from '../../../api/classes/question.class';
import { QuestionForm } from './question.form.component';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none'
  },
  cardTitle: {
    textAlign: 'center',
    paddingBottom: 0
  },
  cardContent: {
    paddingTop: 0
  }
}));

interface Props {
  onSubmit?: (question: Question) => void;
  title?: string;
  acceptButtonText?: string;
  editable: boolean;
  question: Question;
}

const QuestionModalComponent: React.FunctionComponent<Props> = props => {
  const classes = useStyles();

  const handleSubmit = (question: Question) => {
    if (props.onSubmit) props.onSubmit(question);
  };

  return (
    <Container component="div" className={classes.root} tabIndex={-1}>
      <Card raised={true}>
        <CardHeader className={classes.cardTitle} title={props.title} />
        <CardContent className={classes.cardContent}>
          <QuestionForm
            question={props.question}
            editable={props.editable}
            acceptButtonText={props.acceptButtonText}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </Container>
  );
};

export const QuestionModal = React.forwardRef((props: Props, ref: any) => (
  <QuestionModalComponent {...props} />
));
