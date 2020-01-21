import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  MenuItem,
  Button,
  TextField,
  Grid,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FavoriteIcon from '@material-ui/icons/Favorite';

import { RootState } from '../../../store';
import Rating from '@material-ui/lab/Rating';
import { QuestionTypesState } from '../../../store/questionTypes/types';
import { QuestionsState } from '../../../store/questions/types';
import { Question } from '../../../api/classes/question.class';
import { DangerButton } from '../utils/dangerButton.component';
import { Helper } from '../../../helper';

const useStyles = makeStyles(theme => ({
  form: {
    maxWidth: 267
  },
  hotLevelRating: {
    color: '#FD6C9E'
  }
}));

interface OwnProps {
  question: Question;
  editable: boolean;
  disabled?: boolean;
  acceptButtonText?: string;
  deleteButtonText?: string;
  onSubmit?: (question: Question) => void;
  onDelete?: (questionId: string) => void;
}

interface DispatchProps {}

interface StateProps {
  questionTypesState: QuestionTypesState;
  questionsState: QuestionsState;
}

type Props = StateProps & OwnProps & DispatchProps;

const QuestionFormComponent: React.FunctionComponent<Props> = props => {
  const classes = useStyles();
  const { questionTypes } = props.questionTypesState;

  const [text, setText] = useState(props.question.text);
  const [difficulty, setDifficulty] = useState(props.question.difficulty);
  const [hotLevel, setHotLevel] = useState(props.question.hotLevel);
  const [type, setType] = useState(props.question.type);

  const isDenied = (): boolean => {
    const questionLoading = props.questionsState.loading;

    return (
      questionLoading ||
      (questionTypes ? !questionTypes.includes(type) : true) ||
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

  const handleTypeChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    console.log(e);

    props.editable &&
      setType(questionTypes!.find(t => t.id === (e.target.value as string))!);
  };

  const beforeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isDenied() && props.onSubmit) {
      props.onSubmit(
        Helper.clone(props.question, { text, difficulty, hotLevel, type })
      );
    }
  };

  const beforeDelete = () => {
    if (props.onDelete) props.onDelete(props.question.id);
  };

  return (
    <form noValidate onSubmit={beforeSubmit} className={classes.form}>
      <TextField
        name="typeSelect"
        margin="normal"
        variant="outlined"
        select
        required
        disabled={props.disabled}
        fullWidth
        id="typeSelect"
        label="Question type"
        value={type.id}
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
      <TextField
        name="text"
        margin="normal"
        variant="outlined"
        type="text"
        required
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
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Typography component="legend" align="center">
            Difficulty
          </Typography>
          <Rating
            readOnly={!props.editable}
            name="difficulty"
            value={difficulty}
            onChange={handleDifficultyChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography component="legend" align="center">
            Hot Level
          </Typography>
          <Rating
            readOnly={!props.editable}
            name="hotLevel"
            className={classes.hotLevelRating}
            value={hotLevel}
            onChange={handleHotLevelChange}
            icon={<FavoriteIcon fontSize="inherit" />}
          />
        </Grid>
      </Grid>
      {(props.onDelete || props.onSubmit) && (
        <Grid container spacing={2}>
          {props.onDelete && (
            <Grid item xs>
              <DangerButton
                fullWidth
                variant="contained"
                disabled={props.disabled}
                onClick={beforeDelete}
              >
                {props.deleteButtonText}
              </DangerButton>
            </Grid>
          )}
          {props.onSubmit && (
            <Grid item xs>
              <Button
                type="submit"
                fullWidth
                disabled={props.disabled || isDenied()}
                variant="contained"
                color="primary"
              >
                {props.acceptButtonText}
              </Button>
            </Grid>
          )}
        </Grid>
      )}
    </form>
  );
};

QuestionFormComponent.defaultProps = {
  acceptButtonText: 'Confirm Button',
  deleteButtonText: 'Delete Button'
};

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    questionTypesState: states.questionTypesState,
    questionsState: states.questionsState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {};
};

export const QuestionForm = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  RootState
>(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
  QuestionFormComponent
);
