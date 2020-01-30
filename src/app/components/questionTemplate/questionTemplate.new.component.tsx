import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Container, Card, CardContent, CardHeader } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { RootState } from '../../../store';
import { QuestionTemplatesActions } from '../../../store/questionTemplates/actions';
import { QuestionTemplate } from '../../../api/classes/questionTemplate.class';
import { QuestionTemplateForm } from './questionTemplate.form.component';

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
  questionTemplateCreate: (
    questionTemplate: Partial<QuestionTemplate>
  ) => Promise<any>;
}

interface StateProps {}

type Props = StateProps & OwnProps & DispatchProps;

const QuestionTemplateNewComponent: React.FunctionComponent<Props> = props => {
  const classes = useStyles();

  const handleSubmit = (questionTemplate: QuestionTemplate) => {
    props.questionTemplateCreate(questionTemplate);
  };

  return (
    <Container component="div" className={classes.root} tabIndex={-1}>
      <Card raised={true}>
        <CardHeader
          className={classes.cardTitle}
          title="Create a new questionTemplate"
        />
        <CardContent className={classes.cardContent}>
          <QuestionTemplateForm
            questionTemplate={QuestionTemplate.New({})}
            editable
            acceptButtonText="Create questionTemplate"
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </Container>
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
    questionTemplateCreate: async (
      questionTemplate: Partial<QuestionTemplate>
    ) => {
      return await dispatch(
        QuestionTemplatesActions.questionTemplateCreate(questionTemplate)
      );
    }
  };
};

export const QuestionTemplateNew = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  RootState
>(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
  QuestionTemplateNewComponent
);
