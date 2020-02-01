import React, { useState } from 'react';
import {
  Button,
  TextField,
  Grid,
  DialogProps,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
  Container,
  Dialog,
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  MenuItem
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import FavoriteIcon from '@material-ui/icons/Favorite';

import {
  DangerButton,
  DangerIconButton
} from '../utils/dangerButton.component';
import { Helper } from '../../../helper';
import { Question } from '../../../api/classes/question.class';
import { QuestionType } from '../../../api/classes/questionType.class';
import { QuestionTypesState } from '../../../store/questionTypes/types';
import Rating from '@material-ui/lab/Rating';
import { OutlinedDiv } from '../utils/outlinedDiv.component';
import { UserItem } from '../user/user.item.component';
import { RootState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';

const useStyles = makeStyles(theme => ({
  root: {},
  title: {
    padding: '8px 16px',
    paddingTop: 12
  },
  content: {
    padding: '0px 16px'
  },
  actions: {
    padding: '8px 16px',
    '& :first-child': {
      marginLeft: 'auto'
    }
  },
  ratingsGrid: {
    width: 'calc(100% + 16px)',
    marginLeft: -8,
    textAlign: 'center'
  },
  hotLevelRating: {
    color: '#FD6C9E'
  }
}));

interface OwnProps {
  dialogProps?: DialogProps;
  question: Question;
  editable: boolean;
  disabled?: boolean;
  acceptButtonText?: string;
  deleteButtonText?: string;
  displayExtraInfos?: boolean;
  displayType?: boolean;
  displayText?: boolean;
  onAccept?: (question: Question) => void;
  onDelete?: (questionId: string) => void;
  title?: string;
  hideCardShadow?: boolean;
}

interface DispatchProps {}

interface StateProps {
  questionTypesState: QuestionTypesState;
}

type Props = StateProps & OwnProps & DispatchProps;

const QuestionDialogComponent: React.FunctionComponent<Props> = props => {
  const classes = useStyles();
  const { questionTypes } = props.questionTypesState;

  const [text, setText] = useState(props.question.text);
  const [difficulty, setDifficulty] = useState(props.question.difficulty);
  const [hotLevel, setHotLevel] = useState(props.question.hotLevel);
  const [type, setType] = useState(props.question.type);

  const isDenied = (): boolean => {
    return (
      !questionTypes!.find(t => QuestionType.CompareObjects(t, type)) ||
      difficulty === 0 ||
      hotLevel === 0 ||
      text.length === 0
    );
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    props.editable && setText(e.target.value);

  const handleDifficultyChange = (e: any, value: number) =>
    props.editable && setDifficulty(value);

  const handleHotLevelChange = (e: any, value: number) =>
    props.editable && setHotLevel(value);

  const handleTypeChange = (e: React.ChangeEvent<{ value: unknown }>) =>
    props.editable &&
    setType(questionTypes!.find(t => t.id === (e.target.value as string))!);

  React.useEffect(() => {
    setText(props.question.text || '');
    setDifficulty(props.question.difficulty || 1);
    setHotLevel(props.question.hotLevel || 1);
    setType(props.question.type || Helper.clone(questionTypes![0]));
  }, [props.question]);

  const beforeDelete = () => {
    if (props.onDelete) props.onDelete(props.question.id);
  };

  const beforeAccept = () => {
    if (!isDenied() && props.onAccept) {
      props.onAccept(
        Helper.clone(props.question, { text, difficulty, hotLevel, type })
      );
    }
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };

  const renderForm = () => (
    <Box>
      {props.displayType && (
        <TextField
          name="typeSelect"
          margin="normal"
          variant="outlined"
          select={props.editable}
          disabled={props.disabled}
          fullWidth
          id="typeSelect"
          label="Question type"
          value={props.editable ? type.id : type.name}
          onChange={handleTypeChange}
        >
          {questionTypes ? (
            questionTypes.map(t => (
              <MenuItem value={t.id} key={t.id}>
                {t.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Loading...</MenuItem>
          )}
        </TextField>
      )}
      {props.displayText && (
        <TextField
          name="text"
          margin="normal"
          variant="outlined"
          type="text"
          disabled={props.disabled}
          fullWidth
          multiline
          rows={4}
          rowsMax={6}
          id="text"
          label="Text"
          value={text}
          onChange={handleTextChange}
        />
      )}

      <Grid container className={classes.ratingsGrid}>
        <Grid item xs={6}>
          <Typography
            component="legend"
            color={props.disabled ? 'textSecondary' : 'initial'}
          >
            Difficulty
          </Typography>
          <Rating
            disabled={props.disabled}
            readOnly={!props.editable}
            name="difficulty"
            value={difficulty}
            onChange={handleDifficultyChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography
            component="legend"
            color={props.disabled ? 'textSecondary' : 'initial'}
          >
            Hot Level
          </Typography>
          <Rating
            disabled={props.disabled}
            readOnly={!props.editable}
            name="hotLevel"
            className={classes.hotLevelRating}
            value={hotLevel}
            onChange={handleHotLevelChange}
            icon={<FavoriteIcon fontSize="inherit" />}
          />
        </Grid>
      </Grid>
      {props.displayExtraInfos && props.question && (
        <>
          <OutlinedDiv label="Creator" disabled={props.disabled} fullWidth>
            <UserItem user={props.question.creator} />
          </OutlinedDiv>
          <OutlinedDiv
            label="Creation Date"
            disabled={props.disabled}
            fullWidth
          >
            <Box m={1}>
              {props.question.creationDate.toLocaleDateString(
                'fr-FR',
                dateOptions
              )}
            </Box>
          </OutlinedDiv>
          <OutlinedDiv label="Update Date" disabled={props.disabled} fullWidth>
            <Box m={1}>
              {props.question.updateDate.toLocaleDateString(
                'fr-FR',
                dateOptions
              )}
            </Box>
          </OutlinedDiv>
        </>
      )}
    </Box>
  );

  const renderAcceptButton = () => {
    if (props.acceptButtonText) {
      return (
        <Button
          disabled={props.disabled || isDenied()}
          variant="contained"
          color="primary"
          onClick={beforeAccept}
        >
          {props.acceptButtonText}
        </Button>
      );
    } else {
      return (
        <IconButton
          disabled={props.disabled || isDenied()}
          onClick={beforeAccept}
        >
          <CheckIcon />
        </IconButton>
      );
    }
  };

  const renderDeleteButton = () => {
    if (props.deleteButtonText) {
      return (
        <DangerButton
          variant="contained"
          disabled={props.disabled}
          onClick={beforeDelete}
        >
          {props.deleteButtonText}
        </DangerButton>
      );
    } else {
      return (
        <DangerIconButton disabled={props.disabled} onClick={beforeDelete}>
          <DeleteIcon />
        </DangerIconButton>
      );
    }
  };
  const renderDialog = () => (
    <Dialog
      {...(props.dialogProps || { open: false })}
      className={classes.root}
    >
      {props.title && (
        <DialogTitle disableTypography className={classes.title}>
          <Typography component="h3" variant="h5" align="center">
            {props.title}
          </Typography>
        </DialogTitle>
      )}
      <DialogContent className={classes.content}>{renderForm()}</DialogContent>
      {(props.onDelete || props.onAccept) && (
        <DialogActions className={classes.actions}>
          {props.onDelete && renderDeleteButton()}
          {props.onAccept && renderAcceptButton()}
        </DialogActions>
      )}
    </Dialog>
  );

  const renderCard = () => (
    <Card
      className={classes.root}
      raised={false}
      style={{ boxShadow: props.hideCardShadow ? 'none' : '' }}
    >
      {props.title && (
        <CardHeader title={props.title} className={classes.title} />
      )}
      <CardContent className={classes.content}>{renderForm()}</CardContent>
      {(props.onDelete || props.onAccept) && props.editable && (
        <CardActions className={classes.actions}>
          {props.onDelete && renderDeleteButton()}
          {props.onAccept && renderAcceptButton()}
        </CardActions>
      )}
    </Card>
  );

  return props.dialogProps ? renderDialog() : renderCard();
};

QuestionDialogComponent.defaultProps = {
  displayText: true,
  displayType: true
};

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return { questionTypesState: states.questionTypesState };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {};
};

export const QuestionDialog = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  RootState
>(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
  QuestionDialogComponent
);
