import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Question } from '../../../api/classes/question.class';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Grid,
  Paper,
  Container,
  Box
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import Rating from '@material-ui/lab/Rating';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { UserState } from '../../../store/user/types';
import { connect } from 'react-redux';
import { RootState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { QuestionItem } from './question.item.component';

const useStyles = makeStyles(theme => ({}));

interface OwnProps {
  questions: Question[];
  onDelete?: (questionId: string) => void;
  onUpdate?: (question: Question) => void;
  onDetails?: (question: Question) => void;
}

interface DispatchProps {}

interface StateProps {
  userState: UserState;
}

type Props = StateProps & OwnProps & DispatchProps;

const QuestionListComponent: React.FunctionComponent<Props> = props => {
  const classes = useStyles();

  const { questions } = props;

  return (
    <Box component="div">
      {questions.map(question => (
        <QuestionItem question={question} />
      ))}
    </Box>
  );
};

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    userState: states.userState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {};
};

export const QuestionList = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  RootState
>(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
  QuestionListComponent
);
