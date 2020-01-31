import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Question } from '../../../api/classes/question.class';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  Collapse,
  Tooltip,
  ClickAwayListener
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { UserState } from '../../../store/user/types';
import { RootState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { QuestionDialog } from './question.dialog.component';

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
  cardContent: {
    padding: '0 !important'
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
          title={<Typography variant="body1">{question.text}</Typography>}
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
            <QuestionDialog
              question={question}
              editable={user.id === question.creator.id}
              displayType={false}
              displayText={user.id === question.creator.id}
              acceptButtonText="Update"
              onAccept={props.onUpdate}
              deleteButtonText="Delete"
              onDelete={props.onDelete}
              hideCardShadow={true}
            />
          </CardContent>
        </Collapse>
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
