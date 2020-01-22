import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
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
  Box,
  useMediaQuery
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
import { Helper } from '../../../helper';

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
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.up('xs'));
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  const { questions } = props;

  const questionCols = Helper.explodeArray(questions, isLg ? 3 : isSm ? 2 : 1);

  return (
    <>
      <Grid
        container
        spacing={2}
        style={{ margin: questionCols.length > 1 ? -8 : 0 }}
      >
        {questionCols.map((questionList, index) => (
          <Grid
            key={index}
            item
            container
            spacing={2}
            xs={12}
            sm={6}
            lg={4}
            style={{ height: 'fit-content' }}
          >
            {questionList.map(question => (
              <Grid key={question.id} item xs={12}>
                <QuestionItem
                  question={question}
                  onDelete={props.onDelete}
                  onUpdate={props.onUpdate}
                  onDetails={props.onDetails}
                />
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    </>
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
