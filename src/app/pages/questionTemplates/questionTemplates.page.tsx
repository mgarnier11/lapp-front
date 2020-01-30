import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  Box,
  Modal,
  Container,
  Card,
  CardHeader,
  CardContent
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { QuestionTemplatesState } from '../../../store/questionTemplates/types';
import { RootState } from '../../../store';
import { QuestionTemplatesActions } from '../../../store/questionTemplates/actions';
import { QuestionTemplate } from '../../../api/classes/questionTemplate.class';
import { Loading } from '../../components/utils/loading.component';
import { QuestionTemplateList } from '../../components/questionTemplate/questionTemplate.list.component';
import { yesNoController } from '../../components/dialogs/yesno.component';
import { QuestionForm } from '../../components/question/question.form.component';
import { QuestionTemplateForm } from '../../components/questionTemplate/questionTemplate.form.component';

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
  questionTemplateUpdate: (questionTemplate: QuestionTemplate) => Promise<any>;
  questionTemplateRemove: (questionTemplateId: string) => Promise<any>;
}

interface StateProps {
  questionTemplatesState: QuestionTemplatesState;
}

type Props = StateProps & OwnProps & DispatchProps;

const QuestionTemplatesPage: React.FunctionComponent<Props> = (
  props: Props
) => {
  const classes = useStyles();

  const [modalOpen, setModalOpen] = useState(false);
  const [questionTemplate, setQuestionTemplate] = React.useState(
    QuestionTemplate.New({})
  );

  const openModal = () => setModalOpen(true);

  const closeModal = () => setModalOpen(false);

  const handleUpdate = (updatedQuestionTemplate: QuestionTemplate) => {
    closeModal();

    props.questionTemplateUpdate(updatedQuestionTemplate);
  };

  const handleOnUpdate = (clickedQuestionTemplate: QuestionTemplate) => {
    setQuestionTemplate(clickedQuestionTemplate);

    openModal();
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
      <Modal open={modalOpen} onClose={closeModal}>
        <Container
          component="div"
          className={classes.modalRootContent}
          tabIndex={-1}
        >
          <Card raised={true}>
            <CardHeader
              className={classes.modalCardTitle}
              title="Edit template"
            />
            <CardContent className={classes.modalCardContent}>
              <QuestionTemplateForm
                questionTemplate={questionTemplate}
                editable
                onSubmit={handleUpdate}
                acceptButtonText="Confirm update"
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
    questionTemplatesState: states.questionTemplatesState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
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
