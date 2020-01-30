import React from 'react';
import { Container, Card, CardContent, CardHeader } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { QuestionTemplate } from '../../../api/classes/questionTemplate.class';
import { QuestionTemplateForm } from './questionTemplate.form.component';

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
  onSubmit?: (questionTemplate: QuestionTemplate) => void;
  title?: string;
  acceptButtonText?: string;
  editable: boolean;
  questionTemplate: QuestionTemplate;
}

const QuestionTemplateModalComponent: React.FunctionComponent<Props> = props => {
  const classes = useStyles();

  const handleSubmit = (questionTemplate: QuestionTemplate) => {
    if (props.onSubmit) props.onSubmit(questionTemplate);
  };

  return (
    <Container component="div" className={classes.root} tabIndex={-1}>
      <Card raised={true}>
        <CardHeader className={classes.cardTitle} title={props.title} />
        <CardContent className={classes.cardContent}>
          <QuestionTemplateForm
            questionTemplate={props.questionTemplate}
            editable={props.editable}
            acceptButtonText={props.acceptButtonText}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </Container>
  );
};

export const QuestionTemplateModal = React.forwardRef(
  (props: Props, ref: any) => <QuestionTemplateModalComponent {...props} />
);
