import * as lodash from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  Typography,
  Select,
  MenuItem,
  Button,
  TextField,
  InputLabel,
  FormControl,
  Input,
  Chip,
  Checkbox,
  ListItemText
} from '@material-ui/core';
import {
  withStyles,
  WithStyles,
  createStyles,
  StyleRules,
  Theme
} from '@material-ui/core/styles';
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

const styles = (theme: Theme): StyleRules =>
  createStyles({
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center'
    },
    formControl: {
      paddingBottom: theme.spacing(1)
    },
    ratingFormControl: {
      padding: theme.spacing(1),
      flexDirection: 'row'
    },
    ratingComponent: {
      marginLeft: theme.spacing(2)
    },
    hotLevelRating: {
      color: '#FD6C9E'
    },
    questionTypeSelected: {
      fontWeight: theme.typography.fontWeightMedium
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    chip: {
      margin: '2px',
      minWidth: `calc(50% - 4px)`
    }
  });

interface OwnProps {
  game: Game;
  onSubmit: (game: Game) => void;
  buttonText?: string;
}

interface DispatchProps {
  addError: (error: any) => void;
}

interface StateProps {
  gameTypesState: GameTypesState;
  gamesState: GamesState;
  questionTypesState: QuestionTypesState;
}

type Props = StateProps & OwnProps & DispatchProps & WithStyles<typeof styles>;

interface ComponentState {
  game: Game;
  error: string;
}

class GameForm extends React.Component<Props, ComponentState> {
  public static defaultProps = {
    buttonText: 'Accept'
  };

  /**
   *
   */
  constructor(props: Props) {
    super(props);

    if (props.game.questionTypes.length === 0)
      props.game.questionTypes = [...props.questionTypesState.questionTypes!];
    if (GameType.CompareObjects(props.game.type, new GameType()))
      props.game.type = props.gameTypesState.gameTypes![0];

    this.state = {
      game: props.game,
      error: ''
    };

    this.isDenied = this.isDenied.bind(this);
  }

  private static prevPropsGame: Game;
  static getDerivedStateFromProps(nextProps: Props, prevState: ComponentState) {
    let nextPropsGame = nextProps.game;
    if (!Game.CompareObjects(nextPropsGame, GameForm.prevPropsGame)) {
      GameForm.prevPropsGame = lodash.cloneDeep(nextPropsGame);
      return {
        game: lodash.cloneDeep(nextPropsGame)
      };
    }

    return null;
  }

  handleNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      game: { ...this.state.game, name: e.target.value }
    });
  };

  handleMaxDifficultyChange = (e: any, value: number) => {
    this.setState({ game: { ...this.state.game, maxDifficulty: value } });
  };

  handleMaxHotLevelChange = (e: any, value: number) => {
    this.setState({ game: { ...this.state.game, maxHotLevel: value } });
  };

  handleNbTurnsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      game: { ...this.state.game, nbTurns: parseInt(e.target.value) }
    });
  };

  handleGameTypeChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const gameTypes = this.props.gameTypesState.gameTypes;
    if (gameTypes) {
      this.setState({
        game: {
          ...this.state.game,
          type: gameTypes.find(
            t => t.id === parseInt(e.target.value as string)
          )!
        }
      });
    } else {
      console.error('Game types not loaded yet !', 'How did you get here ?');
    }
  };

  handleQuestionTypeChange = (e: React.ChangeEvent<{ value: any }>) => {
    const questionTypes = this.props.questionTypesState.questionTypes;

    if (questionTypes) {
      let selectedTypes: QuestionType[] = e.target.value.filter(
        (v: any) => v instanceof QuestionType
      );
      const clickedId: string = e.target.value.filter(
        (v: any) => typeof v === 'string'
      )[0];

      const indexToRemove = selectedTypes.findIndex(t => t.id === clickedId);
      if (indexToRemove === -1)
        selectedTypes.push(questionTypes.find(t => t.id === clickedId)!);
      else selectedTypes.splice(indexToRemove, 1);

      this.setState({
        game: {
          ...this.state.game,
          questionTypes: selectedTypes
        }
      });
    } else {
      console.error(
        'Question types not loaded yet !',
        'How did you get here ?'
      );
    }
  };

  removeQuestionType = (typeId: string) => {
    this.setState({
      game: {
        ...this.state.game,
        questionTypes: lodash.reject(
          this.state.game.questionTypes,
          t => t.id === typeId
        )
      }
    });
  };

  handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!this.isDenied()) {
      this.props.onSubmit(this.state.game);
    }
  };

  isDenied(): boolean {
    const {
      maxDifficulty,
      maxHotLevel,
      name,
      nbTurns,
      type,
      questionTypes
    } = this.state.game;
    const gameTypes = this.props.gameTypesState.gameTypes;
    const gameLoading = this.props.gamesState.loading;
    let e: string = '';

    if (gameLoading) e = 'Game infos are loading...';
    if (!gameTypes!.find(t => GameType.CompareObjects(t, type)))
      e = 'Incorrect type';
    if (maxDifficulty === 0) e = 'Incorrect maximum difficulty';
    if (maxHotLevel === 0) e = 'Incorrect maximum hot level';
    if (name.length === 0) e = 'Incorrect name';
    if (isNaN(nbTurns) || nbTurns <= 0) e = 'Incorrect nb turns';
    if (questionTypes.length === 0) e = 'Incorrect question types';

    if (e) console.log(e);

    return e !== '';
  }

  isQuestionTypeSelected(questionType: QuestionType) {
    return this.state.game.questionTypes.includes(questionType);
  }

  render() {
    const classes = this.props.classes;
    const {
      maxDifficulty,
      maxHotLevel,
      name,
      nbTurns,
      type,
      questionTypes
    } = this.state.game;

    const allGameTypes = this.props.gameTypesState.gameTypes;
    const allQuestionTypes = this.props.questionTypesState.questionTypes;

    return (
      <form className={classes.form} onSubmit={this.handleFormSubmit}>
        <FormControl className={classes.formControl}>
          <TextField
            style={{ textAlign: 'left' }}
            select
            label="Game Type"
            id="type-select"
            value={type.id}
            fullWidth
            onChange={this.handleGameTypeChange}
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
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            variant="outlined"
            value={name}
            onChange={this.handleNameChange}
          />
        </FormControl>
        <FormControl className={classes.ratingFormControl}>
          <Typography component="legend">Maximum&nbsp;Difficulty</Typography>
          <Rating
            className={classes.ratingComponent}
            name="difficulty"
            value={maxDifficulty}
            onChange={this.handleMaxDifficultyChange}
          />
        </FormControl>
        <FormControl className={classes.ratingFormControl}>
          <Typography component="legend">
            Maximum&nbsp;Hot&nbsp;Level
          </Typography>
          <Rating
            name="hotLevel"
            value={maxHotLevel}
            onChange={this.handleMaxHotLevelChange}
            className={`${classes.ratingComponent} ${classes.hotLevelRating}`}
            icon={<FavoriteIcon fontSize="inherit" />}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            label="Nb Turns"
            fullWidth
            margin="normal"
            variant="outlined"
            type="number"
            value={isNaN(nbTurns) ? '' : nbTurns}
            onChange={this.handleNbTurnsChange}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="question-type-select">Question Types</InputLabel>
          <Select
            labelId="question-type-select"
            multiple
            input={<Input />}
            value={questionTypes}
            onChange={this.handleQuestionTypeChange}
            renderValue={selected => (
              <div className={classes.chips}>
                {(selected as QuestionType[]).map(value => (
                  <Chip
                    key={value.id}
                    label={value.name}
                    className={classes.chip}
                    onDelete={() => this.removeQuestionType(value.id)}
                  />
                ))}
              </div>
            )}
            MenuProps={{
              transformOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
              },
              PaperProps: {
                style: {
                  maxHeight: 300
                }
              }
            }}
          >
            {allQuestionTypes ? (
              allQuestionTypes.map(questionType => (
                <MenuItem key={questionType.id} value={questionType.id}>
                  <Checkbox
                    color="primary"
                    checked={
                      questionTypes.find(t =>
                        QuestionType.CompareObjects(questionType, t)
                      ) !== undefined
                    }
                  />
                  <ListItemText primary={questionType.name} />
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Loading...</MenuItem>
            )}
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={this.isDenied()}
        >
          {allGameTypes && allQuestionTypes ? this.props.buttonText : 'Loading'}
        </Button>
      </form>
    );
  }
}

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

export default connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(withStyles(styles)(GameForm));
