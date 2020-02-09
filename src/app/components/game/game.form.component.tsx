import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  Typography,
  MenuItem,
  Button,
  TextField,
  Grid,
  Chip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import FavoriteIcon from '@material-ui/icons/Favorite';

import { RootState } from '../../../store';
import { addError } from '../../../store/errors/actions';
import { Game } from '../../../api/classes/game.class';
import { GameTypesState } from '../../../store/gameTypes/types';
import { GamesState } from '../../../store/games/types';
import { QuestionTypesState } from '../../../store/questionTypes/types';
import { QuestionType } from '../../../api/classes/questionType.class';
import { GameType } from '../../../api/classes/gameType.class';
import { Helper } from '../../../helper';
import { DangerButton } from '../utils/dangerButton.component';
import { OutlinedDiv } from '../utils/outlinedDiv.component';

const useStyles = makeStyles(theme => ({
  hotLevelRating: {
    color: '#FD6C9E'
  },
  questionTypeContainer: {
    padding: 2
  },
  questionTypeChip: {
    width: 'calc(50% - 4px)',
    margin: 2,
    marginBottom: 3,
    '&:nth-child(-n+2)': {
      marginTop: 7
    },
    '&:nth-last-child(-n+2)': {
      marginBottom: 5
    }
  }
}));

interface OwnProps {
  game: Game;
  editable: boolean;
  disabled?: boolean;
  acceptButtonText?: string;
  deleteButtonText?: string;
  onSubmit?: (game: Game) => void;
  onDelete?: (gameId: string) => void;
}

interface DispatchProps {
  addError: (error: any) => void;
}

interface StateProps {
  gameTypesState: GameTypesState;
  gamesState: GamesState;
  questionTypesState: QuestionTypesState;
}

type Props = StateProps & OwnProps & DispatchProps;

const GameFormComponent: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  const allGameTypes = props.gameTypesState.gameTypes!;
  const allQuestionsTypes = props.questionTypesState.questionTypes!;

  console.log(props.game);

  const [name, setName] = useState(props.game.name);
  const [type, setType] = useState(
    props.game.type.name !== '' ? props.game.type : allGameTypes[0]
  );
  const [maxDifficulty, setMaxDifficulty] = useState(props.game.maxDifficulty);
  const [maxHotLevel, setMaxHotLevel] = useState(props.game.maxHotLevel);
  const [nbTurns, setNbTurns] = useState(props.game.nbTurns);
  const [questionTypes, setQuestionTypes] = useState(props.game.questionTypes);

  const isDenied = (): boolean => {
    const gameLoading = props.gamesState.loading;

    return (
      gameLoading ||
      !allGameTypes!.find(t => GameType.CompareObjects(t, type)) ||
      maxDifficulty === 0 ||
      maxHotLevel === 0 ||
      name.length === 0 ||
      isNaN(nbTurns) ||
      nbTurns <= 0 ||
      questionTypes.length === 0
    );
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    props.editable && setName(e.target.value);

  const handleTypeChange = (e: React.ChangeEvent<{ value: unknown }>) =>
    props.editable &&
    setType(
      allGameTypes!.find(g => g.id === parseInt(e.target.value as string))!
    );

  const handleMaxDifficultyChange = (e: any, value: number) =>
    props.editable && setMaxDifficulty(value);

  const handleMaxHotLevelChange = (e: any, value: number) =>
    props.editable && setMaxHotLevel(value);

  const handleNbTurnsChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    props.editable && setNbTurns(parseInt(e.target.value));

  const handleQuestionTypesChange = (value: QuestionType[]) =>
    props.editable && setQuestionTypes(value);

  const beforeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isDenied() && props.onSubmit) {
      props.onSubmit(
        Helper.clone(props.game, {
          name,
          type,
          maxDifficulty,
          maxHotLevel,
          nbTurns,
          questionTypes
        })
      );
    }
  };

  const beforeDelete = () => {
    if (props.onDelete) props.onDelete(props.game.id);
  };

  const switchQuestionType = (questionTypeId: string) => {
    const typeIndex = questionTypes.findIndex(qt => qt.id === questionTypeId);

    if (typeIndex !== -1) {
      handleQuestionTypesChange(
        questionTypes.filter(qt => qt.id !== questionTypeId)
      );
    } else {
      handleQuestionTypesChange([
        ...questionTypes,
        allQuestionsTypes.find(qt => qt.id === questionTypeId)!
      ]);
    }
  };

  return (
    <form onSubmit={beforeSubmit}>
      <TextField
        style={{ textAlign: 'left', marginTop: 0 }}
        name="typeSelect"
        margin="normal"
        variant="outlined"
        select
        required
        disabled={props.disabled}
        fullWidth
        id="typeSelect"
        label="Game type"
        value={type.id}
        onChange={handleTypeChange}
      >
        {allGameTypes ? (
          allGameTypes.map(t => (
            <MenuItem value={t.id} key={t.id}>
              {t.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>Loading...</MenuItem>
        )}
      </TextField>
      <TextField
        name="name"
        margin="normal"
        variant="outlined"
        type="text"
        required
        disabled={props.disabled}
        fullWidth
        id="name"
        label="Name"
        value={name}
        onChange={handleNameChange}
      />
      <Grid container spacing={3} style={{ textAlign: 'center' }}>
        <Grid item xs={6}>
          <Typography component="legend">Maximum&nbsp;Difficulty</Typography>
          <Rating
            name="maxDifficulty"
            value={maxDifficulty}
            onChange={handleMaxDifficultyChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography component="legend">
            Maximum&nbsp;Hot&nbsp;Level
          </Typography>
          <Rating
            name="maxHotLevel"
            disabled={props.disabled}
            className={classes.hotLevelRating}
            value={maxHotLevel}
            onChange={handleMaxHotLevelChange}
            icon={<FavoriteIcon fontSize="inherit" />}
          />
        </Grid>
      </Grid>
      <TextField
        name="nbTurns"
        margin="normal"
        variant="outlined"
        type="number"
        required
        disabled={props.disabled}
        fullWidth
        id="nbTurns"
        label="Nb Turns"
        value={nbTurns}
        onChange={handleNbTurnsChange}
      />
      <OutlinedDiv label="Question Types" fullWidth>
        {allQuestionsTypes.map(t => (
          <Chip
            label={t.name}
            key={t.id}
            color={
              questionTypes.find(type => QuestionType.CompareObjects(t, type))
                ? 'primary'
                : 'default'
            }
            disabled={props.disabled}
            className={classes.questionTypeChip}
            onClick={() => switchQuestionType(t.id)}
          />
        ))}
      </OutlinedDiv>
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

GameFormComponent.defaultProps = {
  deleteButtonText: 'Delete Button',
  acceptButtonText: 'Accept Button'
};

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    gameTypesState: states.gameTypesState,
    gamesState: states.gamesState,
    questionTypesState: states.questionTypesState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    addError: async (error: any) => {
      await dispatch(addError(error));
    }
  };
};

export const GameForm = connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(GameFormComponent);
