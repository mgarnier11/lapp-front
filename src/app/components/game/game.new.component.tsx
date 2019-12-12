import * as lodash from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextareaAutosize,
  Grid,
  Select,
  MenuItem,
  Button,
  TextField,
  InputLabel,
  FormControl,
  FormLabel
} from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
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
import { GameActions } from '../../../store/game/actions';
import { addError } from '../../../store/error/actions';
import { Game } from '../../../api/classes/game.class';
import { Loading } from '../loading/loading.component';
import { GameTypeActions } from '../../../store/gameType/actions';
import { GameTypeState } from '../../../store/gameType/types';
import { GameState } from '../../../store/game/types';
import { multiplayerGameTypeNames } from '../../../api/classes/gameType.class';

const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'fit-content',
      outline: 'none'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center'
    },
    card: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      textAlign: 'center'
    },
    cardContent: {
      padding: '0',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
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
    }
  });

interface OwnProps {}

interface DispatchProps {
  gameCreate: (game: Partial<Game>) => Promise<any>;
  gameTypeGetAll: () => void;
  addError: (error: any) => void;
}

interface StateProps {
  gameTypeState: GameTypeState;
  gameState: GameState;
}

type Props = StateProps &
  OwnProps &
  DispatchProps &
  WithSnackbarProps &
  WithStyles<typeof styles>;

interface ComponentState {
  game: Game;
}

class GameNewComponent extends React.Component<Props, ComponentState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      game: new Game()
    };

    this.isDenied = this.isDenied.bind(this);
  }

  reloadDatas() {
    if (
      !this.props.gameTypeState.gameTypes &&
      !this.props.gameTypeState.loading
    ) {
      this.props.gameTypeGetAll();
    }
  }

  componentDidMount() {
    this.reloadDatas();
  }

  componentDidUpdate() {
    this.reloadDatas();
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

  handleTypeChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const gameTypes = this.props.gameTypeState.gameTypes;
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

  handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!this.isDenied()) {
      this.props.gameCreate(this.state.game).then((game: Game) => {});
    }
  };

  isDenied(): boolean {
    const {
      maxDifficulty,
      maxHotLevel,
      name,
      nbTurns,
      type,
      users
    } = this.state.game;
    const gameTypes = this.props.gameTypeState.gameTypes;
    const gameLoading = this.props.gameState.loading;
    console.log(type.name in multiplayerGameTypeNames && users.length === 0);

    return (
      gameLoading ||
      (gameTypes ? !gameTypes.includes(type) : true) ||
      maxDifficulty === 0 ||
      maxHotLevel === 0 ||
      name.length === 0 ||
      nbTurns <= 0 ||
      (type.name in multiplayerGameTypeNames && users.length === 0)
    );
  }

  render() {
    const classes = this.props.classes;
    const {
      maxDifficulty,
      maxHotLevel,
      name,
      nbTurns,
      type,
      users
    } = this.state.game;
    const gameTypes = this.props.gameTypeState.gameTypes;

    return (
      <Container component="main" className={classes.root} tabIndex={-1}>
        <Card className={classes.card} raised={true}>
          <CardHeader title="Create a new game" />
          <CardContent className={classes.cardContent}>
            <form className={classes.form} onSubmit={this.handleFormSubmit}>
              <FormControl className={classes.formControl}>
                <TextField
                  style={{ textAlign: 'left' }}
                  select
                  label="Game Type"
                  id="type-select"
                  value={type.id}
                  fullWidth
                  onChange={this.handleTypeChange}
                >
                  {gameTypes ? (
                    gameTypes.map(t => (
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
                <Typography component="legend">
                  Maximum&nbsp;Difficulty
                </Typography>
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
                  value={nbTurns}
                  onChange={this.handleNbTurnsChange}
                />
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={this.isDenied()}
              >
                {gameTypes ? 'Create game' : 'Loading'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    );
  }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    gameTypeState: states.gameTypeState,
    gameState: states.gameState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    gameCreate: async (game: Partial<Game>) => {
      return await dispatch(GameActions.gameCreate(game));
    },
    gameTypeGetAll: async () => {
      await dispatch(GameTypeActions.gameTypeGetAll());
    },
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
)(withStyles(styles)(withSnackbar(GameNewComponent)));
