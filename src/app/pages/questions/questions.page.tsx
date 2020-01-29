import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { QuestionsState } from '../../../store/questions/types';
import { RootState } from '../../../store';
import { QuestionsActions } from '../../../store/questions/actions';
import { Question } from '../../../api/classes/question.class';
import { Loading } from '../../components/utils/loading.component';
import { QuestionTypesState } from '../../../store/questionTypes/types';
import { QuestionList } from '../../components/question/question.list.component';
import { yesNoController } from '../../components/dialogs/yesno.component';

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(10)
  },
  modalRootContent: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fit-content',
    outline: 'none'
  },
  modalCardTitle: {
    textAlign: 'center',
    paddingBottom: 0
  },
  modalCardContent: {
    paddingTop: 0
  }
}));

interface OwnProps {}

interface DispatchProps {
  questionUpdate: (question: Question) => Promise<any>;
  questionRemove: (questionId: string) => Promise<any>;
}

interface StateProps {
  questionsState: QuestionsState;
  questionTypesState: QuestionTypesState;
}

type Props = StateProps & OwnProps & DispatchProps;

const QuestionsPage: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  const handleOnUpdate = (clickedQuestion: Question) => {
    props.questionUpdate(clickedQuestion);
  };

  const handleOnDelete = (questionId: string) => {
    yesNoController()!
      .present({
        title: 'Are you sure you want to delete this question\u00a0?',
        acceptText: 'Yes',
        denyText: 'No'
      })
      .then(() => {
        props.questionRemove(questionId);
      })
      .catch(error => {
        //this.props.addError(error);
      });
  };

  return (
    <Box component="div" className={classes.root}>
      {props.questionsState.questions ? (
        <QuestionList
          questions={props.questionsState.questions}
          onUpdate={handleOnUpdate}
          onDelete={handleOnDelete}
        />
      ) : (
        <Loading />
      )}
    </Box>
  );
};

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    questionsState: states.questionsState,
    questionTypesState: states.questionTypesState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    questionUpdate: async (question: Question) => {
      return await dispatch(QuestionsActions.questionUpdate(question));
    },
    questionRemove: async (questionId: string) => {
      return await dispatch(QuestionsActions.questionRemove(questionId));
    }
  };
};

export const Questions = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  RootState
>(
  mapStateToProps,
  mapDispatchToProps
)(QuestionsPage);
