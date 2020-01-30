import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Box, Modal, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import { QuestionsState } from '../../../store/questions/types';
import { RootState } from '../../../store';
import { QuestionsActions } from '../../../store/questions/actions';
import { Question } from '../../../api/classes/question.class';
import { Loading } from '../../components/utils/loading.component';
import { QuestionTypesState } from '../../../store/questionTypes/types';
import { QuestionList } from '../../components/question/question.list.component';
import { yesNoController } from '../../components/dialogs/yesno.component';
import { QuestionModal } from '../../components/question/question.modal.component';

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(10)
  }
}));

interface OwnProps {}

interface DispatchProps {
  questionCreate: (question: Question) => Promise<any>;
  questionUpdate: (question: Question) => Promise<any>;
  questionRemove: (questionId: string) => Promise<any>;
}

interface StateProps {
  questionsState: QuestionsState;
  questionTypesState: QuestionTypesState;
}

type Props = StateProps & OwnProps & DispatchProps;

interface ModalProps {
  open: boolean;
  question: Question;
  title?: string;
  onSubmit?: (question: Question) => void;
  submitButtonText?: string;
}
const QuestionsPage: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  const [modalProps, setModalProps] = useState({
    open: false,
    question: Question.New({})
  } as ModalProps);

  const openModal = () => setModalProps({ ...modalProps, open: true });

  const closeModal = () => setModalProps({ ...modalProps, open: false });

  const handleCreate = (createdQuestion: Question) => {
    closeModal();

    props.questionCreate(createdQuestion);
  };

  const handleOnCreate = () => {
    setModalProps({
      open: true,
      onSubmit: handleCreate,
      question: Question.New({}),
      title: 'Create a new question',
      submitButtonText: 'Create'
    });
  };

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
    <>
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

      <Fab
        className="floating-action-button"
        onClick={handleOnCreate}
        style={{ zIndex: 10 }}
      >
        <AddIcon />
      </Fab>

      <Modal open={modalProps.open} onClose={closeModal}>
        <QuestionModal
          question={modalProps.question}
          editable
          title={modalProps.title}
          acceptButtonText={modalProps.submitButtonText}
          onSubmit={modalProps.onSubmit}
        />
      </Modal>
    </>
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
    questionCreate: async (question: Question) => {
      return await dispatch(QuestionsActions.questionCreate(question));
    },
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
