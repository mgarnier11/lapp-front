import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Box, Fab, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import { QuestionTypesState } from '../../../store/questionTypes/types';
import { RootState } from '../../../store';
import { QuestionTypesActions } from '../../../store/questionTypes/actions';
import { QuestionType } from '../../../api/classes/questionType.class';
import { Loading } from '../../components/utils/loading.component';
import { QuestionTypeList } from '../../components/questionType/questionType.list.component';
import { yesNoController } from '../../components/dialogs/yesno.component';
import { QuestionTypeDialog } from '../../components/questionType/questionType.dialog.component';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(10),
    paddingTop: theme.spacing(1),
  },
}));

interface OwnProps {}

interface DispatchProps {
  questionTypeCreate: (questionTempalte: QuestionType) => Promise<any>;
  questionTypeUpdate: (questionType: QuestionType) => Promise<any>;
  questionTypeRemove: (questionTypeId: string) => Promise<any>;
}

interface StateProps {
  questionTypesState: QuestionTypesState;
}

type Props = StateProps & OwnProps & DispatchProps;

interface ModalProps {
  open: boolean;
  questionType: QuestionType;
  title?: string;
  onAccept?: (questionType: QuestionType) => void;
  submitButtonText?: string;
}

const QuestionTypesPage: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  const [modalProps, setModalProps] = useState({
    open: false,
    questionType: QuestionType.New({}),
  } as ModalProps);

  console.log(modalProps);

  const openModal = () => setModalProps({ ...modalProps, open: true }); // eslint-disable-line

  const closeModal = () => setModalProps({ ...modalProps, open: false });

  const handleUpdate = (updatedQuestionType: QuestionType) => {
    closeModal();

    props.questionTypeUpdate(updatedQuestionType);
  };

  const handleCreate = (createdQuestionType: QuestionType) => {
    closeModal();

    props.questionTypeCreate(createdQuestionType);
  };

  const handleOnUpdate = (clickedQuestionType: QuestionType) => {
    setModalProps({
      open: true,
      onAccept: handleUpdate,
      questionType: clickedQuestionType,
      title: 'Edit type',
      submitButtonText: 'Confirm update',
    });
  };

  const handleOnCreate = () => {
    setModalProps({
      open: true,
      onAccept: handleCreate,
      questionType: QuestionType.New({}),
      title: 'Create a new type',
      submitButtonText: 'Create',
    });
  };

  const handleOnDelete = (questionTypeId: string) => {
    yesNoController()!
      .present({
        title: 'Are you sure you want to delete this type\u00a0?',
        acceptText: 'Yes',
        denyText: 'No',
      })
      .then(() => {
        props.questionTypeRemove(questionTypeId);
      })
      .catch((error) => {
        //this.props.addError(error);
      });
  };

  return (
    <>
      <Box component="div" className={classes.root}>
        <Typography component="h2" variant="h5" align="center">
          Question types
        </Typography>
        {props.questionTypesState.questionTypes ? (
          <QuestionTypeList
            questionTypes={props.questionTypesState.questionTypes}
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

      <QuestionTypeDialog
        dialogProps={{
          open: modalProps.open,
          onClose: closeModal,
        }}
        questionType={modalProps.questionType}
        editable
        title={modalProps.title}
        acceptButtonText={modalProps.submitButtonText}
        onAccept={modalProps.onAccept}
      />
    </>
  );
};

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    questionTypesState: states.questionTypesState,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    questionTypeCreate: async (questionType: QuestionType) => {
      return await dispatch(
        QuestionTypesActions.questionTypeCreate(questionType)
      );
    },
    questionTypeUpdate: async (questionType: QuestionType) => {
      return await dispatch(
        QuestionTypesActions.questionTypeUpdate(questionType)
      );
    },
    questionTypeRemove: async (questionTypeId: string) => {
      return await dispatch(
        QuestionTypesActions.questionTypeRemove(questionTypeId)
      );
    },
  };
};

export const QuestionTypes = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  RootState
>(
  mapStateToProps,
  mapDispatchToProps
)(QuestionTypesPage);
