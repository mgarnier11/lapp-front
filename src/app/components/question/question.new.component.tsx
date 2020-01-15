import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Container, Card, CardContent, CardHeader } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { RootState } from '../../../store';
import { QuestionsActions } from '../../../store/questions/actions';
import { Question } from '../../../api/classes/question.class';
import { QuestionForm } from './question.form.component';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fit-content',
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

interface OwnProps {}

interface DispatchProps {
  questionCreate: (question: Partial<Question>) => Promise<any>;
}

interface StateProps {}

type Props = StateProps & OwnProps & DispatchProps;

const QuestionNewComponent: React.FunctionComponent<Props> = props => {
  const classes = useStyles();

  const handleSubmit = (question: Question) => {
    props.questionCreate(question);
  };

  return (
    <Container component="div" className={classes.root} tabIndex={-1}>
      <Card raised={true}>
        <CardHeader
          className={classes.cardTitle}
          title="Create a new question"
        />
        <CardContent className={classes.cardContent}>
          <QuestionForm
            question={Question.New({})}
            editable
            acceptButtonText="Create question"
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </Container>
  );
};

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    questionTypesState: states.questionTypesState,
    questionsState: states.questionsState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    questionCreate: async (question: Partial<Question>) => {
      return await dispatch(QuestionsActions.questionCreate(question));
    }
  };
};

export const QuestionNew = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  RootState
>(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
  QuestionNewComponent
);
