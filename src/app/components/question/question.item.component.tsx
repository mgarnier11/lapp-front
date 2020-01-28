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
  Box,
  Avatar,
  Collapse,
  Tooltip,
  ClickAwayListener,
  ButtonBase
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import Rating from '@material-ui/lab/Rating';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { UserItem } from '../user/user.item.component';
import { UserState } from '../../../store/user/types';
import { RootState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { QuestionForm } from './question.form.component';

const useStyles = makeStyles(theme => ({
  deleteButton: {
    marginLeft: 'auto'
  },
  hotLevelRating: {
    color: '#FD6C9E',
    textAlign: 'center'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expanded: {
    transform: 'rotate(180deg)'
  },
  cardHeader: {
    //paddingBottom: 0
  },
  cardContent: {
    paddingTop: '0 !important'
  },
  alignSelf: {
    alignSelf: 'baseline'
  }
}));

interface OwnProps {
  question: Question;
  onDelete?: (questionId: string) => void;
  onUpdate?: (question: Question) => void;
}

interface DispatchProps {}

interface StateProps {
  userState: UserState;
}

type Props = StateProps & OwnProps & DispatchProps;

const QuestionItemComponent: React.FunctionComponent<Props> = props => {
  const classes = useStyles();

  const { question } = props;
  const user = props.userState.user!;

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => setExpanded(!expanded);

  return (
    <ClickAwayListener onClickAway={() => setExpanded(false)}>
      <Card>
        <CardHeader
          avatar={
            <Tooltip title={question.type.name}>
              <Avatar>{question.type.name.substr(0, 1).toUpperCase()}</Avatar>
            </Tooltip>
          }
          title={
            <Typography variant="body1">
              {expanded ? 'Type : ' + question.type.name : question.text}
            </Typography>
          }
          className={classes.cardHeader}
          action={
            <IconButton
              className={
                classes.expand + (expanded ? ' ' + classes.expanded : '')
              }
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          }
          classes={{ avatar: classes.alignSelf }}
          onClick={() => setExpanded(!expanded)}
        />
        <Collapse in={expanded} unmountOnExit>
          <CardContent className={classes.cardContent}>
            {/*<UserItem user={question.creator} />
          <Box marginTop={1}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="subtitle2">Difficulty</Typography>
                  <Rating
                    readOnly
                    name="difficulty"
                    value={question.difficulty}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="subtitle2">Hot Level</Typography>
                  <Rating
                    readOnly
                    name="hotLevel"
                    className={classes.hotLevelRating}
                    value={question.hotLevel}
                    icon={<FavoriteIcon fontSize="inherit" />}
                  />
                </Box>
              </Grid>
            </Grid>
      
          </Box>
          */}
            <QuestionForm
              question={question}
              editable={user.id === question.creator.id}
              disabled={!(user.id === question.creator.id)}
              displayType={false}
              acceptButtonText="Update"
              onSubmit={props.onUpdate}
              deleteButtonText="Delete"
              onDelete={props.onDelete}
            />
            {/*
          <Box marginTop={1}>
            <Typography variant="subtitle2">
              Type : {question.type.name}
            </Typography>
           </Box>
           */}
          </CardContent>
        </Collapse>
        {/*
      <CardActions disableSpacing>
        {props.onDetails && (
          <Tooltip title="Details">
            <IconButton onClick={() => props.onDetails!(question)}>
              <ZoomOutMapIcon />
            </IconButton>
          </Tooltip>
        )}

        {props.onUpdate && user.id === question.creator.id && (
          <Tooltip title="Edit">
            <IconButton onClick={() => props.onUpdate!(question)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}

        {props.onDelete && user.id === question.creator.id && (
          <Tooltip title="Delete">
            <IconButton
              onClick={() => props.onDelete!(question.id)}
              className={classes.deleteButton}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
        */}
      </Card>
    </ClickAwayListener>
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

export const QuestionItem = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  RootState
>(
  mapStateToProps,
  mapDispatchToProps
)(QuestionItemComponent);
