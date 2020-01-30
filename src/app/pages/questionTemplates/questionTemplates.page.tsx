import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Box, Modal, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import { QuestionTemplatesState } from '../../../store/questionTemplates/types';
import { RootState } from '../../../store';
import { QuestionTemplatesActions } from '../../../store/questionTemplates/actions';
import { QuestionTemplate } from '../../../api/classes/questionTemplate.class';
import { Loading } from '../../components/utils/loading.component';
import { QuestionTemplateList } from '../../components/questionTemplate/questionTemplate.list.component';
import { yesNoController } from '../../components/dialogs/yesno.component';
import { QuestionTemplateModal } from '../../components/questionTemplate/questionTemplate.modal.component';

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
  questionTemplateCreate: (questionTempalte: QuestionTemplate) => Promise<any>;
  questionTemplateUpdate: (questionTemplate: QuestionTemplate) => Promise<any>;
  questionTemplateRemove: (questionTemplateId: string) => Promise<any>;
}

interface StateProps {
  questionTemplatesState: QuestionTemplatesState;
}

type Props = StateProps & OwnProps & DispatchProps;

interface ModalProps {
  open: boolean;
  questionTemplate: QuestionTemplate;
  title?: string;
  onSubmit?: (questionTemplate: QuestionTemplate) => void;
  submitButtonText?: string;
}

const QuestionTemplatesPage: React.FunctionComponent<Props> = (
  props: Props
) => {
  const classes = useStyles();

  const [modalProps, setModalProps] = useState({
    open: false,
    questionTemplate: QuestionTemplate.New({})
  } as ModalProps);

  const openModal = () => setModalProps({ ...modalProps, open: true });

  const closeModal = () => setModalProps({ ...modalProps, open: false });

  const handleUpdate = (updatedQuestionTemplate: QuestionTemplate) => {
    closeModal();

    props.questionTemplateUpdate(updatedQuestionTemplate);
  };

  const handleCreate = (createdQuestionTemplate: QuestionTemplate) => {
    closeModal();

    props.questionTemplateCreate(createdQuestionTemplate);
  };

  const handleOnUpdate = (clickedQuestionTemplate: QuestionTemplate) => {
    setModalProps({
      open: true,
      onSubmit: handleUpdate,
      questionTemplate: clickedQuestionTemplate,
      title: 'Edit template',
      submitButtonText: 'Confirm update'
    });
  };

  const handleOnCreate = () => {
    setModalProps({
      open: true,
      onSubmit: handleCreate,
      questionTemplate: QuestionTemplate.New({}),
      title: 'Create a new template',
      submitButtonText: 'Create'
    });
  };

  const handleOnDelete = (questionTemplateId: string) => {
    yesNoController()!
      .present({
        title: 'Are you sure you want to delete this template\u00a0?',
        acceptText: 'Yes',
        denyText: 'No'
      })
      .then(() => {
        props.questionTemplateRemove(questionTemplateId);
      })
      .catch(error => {
        //this.props.addError(error);
      });
  };

  return (
    <>
      <Box component="div" className={classes.root}>
        {props.questionTemplatesState.questionTemplates ? (
          <QuestionTemplateList
            questionTemplates={props.questionTemplatesState.questionTemplates}
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
        <QuestionTemplateModal
          questionTemplate={modalProps.questionTemplate}
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
    questionTemplatesState: states.questionTemplatesState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    questionTemplateCreate: async (questionTemplate: QuestionTemplate) => {
      return await dispatch(
        QuestionTemplatesActions.questionTemplateCreate(questionTemplate)
      );
    },
    questionTemplateUpdate: async (questionTemplate: QuestionTemplate) => {
      return await dispatch(
        QuestionTemplatesActions.questionTemplateUpdate(questionTemplate)
      );
    },
    questionTemplateRemove: async (questionTemplateId: string) => {
      return await dispatch(
        QuestionTemplatesActions.questionTemplateRemove(questionTemplateId)
      );
    }
  };
};

export const QuestionTemplates = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  RootState
>(
  mapStateToProps,
  mapDispatchToProps
)(QuestionTemplatesPage);
