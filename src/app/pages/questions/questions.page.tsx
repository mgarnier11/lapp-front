import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  Container,
  Box,
  Modal,
  Card,
  CardHeader,
  CardContent,
  Backdrop
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { QuestionsState } from '../../../store/questions/types';
import { RootState } from '../../../store';
import { QuestionsActions } from '../../../store/questions/actions';
import { Question } from '../../../api/classes/question.class';
import { Loading } from '../../components/utils/loading.component';
import { QuestionTypesState } from '../../../store/questionTypes/types';
import { QuestionList } from '../../components/question/question.list.component';
import { QuestionForm } from '../../components/question/question.form.component';
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

  const [modalOpen, setModalOpen] = React.useState(false);
  const [question, setQuestion] = React.useState(Question.New({}));
  const [allowUpdate, setAllowUpdate] = React.useState(false);

  const openModal = () => setModalOpen(true);

  const closeModal = () => setModalOpen(false);

  const handleUpdate = (updatedQuestion: Question) => {
    closeModal();

    props.questionUpdate(updatedQuestion);
  };

  const handleOnDetails = (clickedQuestion: Question) => {
    setQuestion(clickedQuestion);
    setAllowUpdate(false);

    openModal();
  };

  const handleOnUpdate = (clickedQuestion: Question) => {
    setQuestion(clickedQuestion);
    setAllowUpdate(true);

    openModal();
  };

  const handleOnDelete = (questionId: string) => {
    yesNoController!
      .present({
        title: 'Are you sure you want to delete this question ?',
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
            onDetails={handleOnDetails}
            onUpdate={handleOnUpdate}
            onDelete={handleOnDelete}
          />
        ) : (
          <Loading />
        )}
      </Box>

      <Modal open={modalOpen} onClose={closeModal}>
        <Container
          component="div"
          className={classes.modalRootContent}
          tabIndex={-1}
        >
          <Card raised={true}>
            <CardHeader
              className={classes.modalCardTitle}
              title={allowUpdate ? 'Edit Question' : 'Question Details'}
            />
            <CardContent className={classes.modalCardContent}>
              <QuestionForm
                question={question}
                disabled={!allowUpdate}
                editable={allowUpdate}
                acceptButtonText="Update"
                onSubmit={handleUpdate}
              />
            </CardContent>
          </Card>
        </Container>
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
