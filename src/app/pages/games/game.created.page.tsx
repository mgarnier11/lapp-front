import * as lodash from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
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
import { GamesActions } from '../../../store/games/actions';
import { addError } from '../../../store/errors/actions';
import { Game } from '../../../api/classes/game.class';
import { GameTypesActions } from '../../../store/gameTypes/actions';
import { GameTypesState } from '../../../store/gameTypes/types';
import { GamesState } from '../../../store/games/types';
import { multiplayerGameTypeNames } from '../../../api/classes/gameType.class';
import { QuestionTypesActions } from '../../../store/questionTypes/actions';
import { QuestionTypesState } from '../../../store/questionTypes/types';
import { QuestionType } from '../../../api/classes/questionType.class';
import { GameActions } from '../../../store/game/actions';
import { GameState } from '../../../store/game/types';

const styles = (theme: Theme): StyleRules => createStyles({});

interface OwnProps {
  displayId?: string;
}

interface DispatchProps {
  gameTypeGetAll: () => Promise<any>;
  questionTypeGetall: () => Promise<any>;
  gameGetByDisplayId: (displayId: string) => Promise<any>;
  gameUpdate: (game: Game) => Promise<any>;
  gameRemove: (gameId: string) => Promise<any>;
  addError: (error: any) => void;
}

interface StateProps {
  gameTypesState: GameTypesState;
  gameState: GameState;
  questionTypesState: QuestionTypesState;
}

type Props = StateProps &
  OwnProps &
  DispatchProps &
  WithSnackbarProps &
  WithStyles<typeof styles>;

interface ComponentState {
  game: Game;
}

class GameCreated extends React.Component<Props, ComponentState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      game: new Game()
    };
  }

  reloadDatas() {
    if (
      !this.props.gameTypesState.gameTypes &&
      !this.props.gameTypesState.loading
    ) {
      this.props.gameTypeGetAll();
    }

    if (
      !this.props.questionTypesState.questionTypes &&
      !this.props.questionTypesState.loading
    ) {
      this.props.questionTypeGetall();
    }

    if (
      this.props.displayId &&
      !this.props.gameState.game &&
      !this.props.gameState.loading
    ) {
      this.props.gameGetByDisplayId(this.props.displayId);
    }
  }

  componentDidMount() {
    this.reloadDatas();
  }

  componentDidUpdate() {
    this.reloadDatas();
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: ComponentState) {
    let nextGame = nextProps.gameState.game;
    if (nextGame) {
      let prevGame = prevState.game;

      if (!Game.CompareObjects(nextGame, prevGame)) {
        return {
          game: lodash.cloneDeep(nextGame)
        };
      }
    }

    return null;
  }

  render() {
    const classes = this.props.classes;
    const allGameTypes = this.props.gameTypesState.gameTypes;
    const allQuestionTypes = this.props.questionTypesState.questionTypes;

    const game = this.props.gameState.game;

    return <Container component="main"></Container>;
  }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    gameTypesState: states.gameTypesState,
    gameState: states.gameState,
    questionTypesState: states.questionTypesState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    gameTypeGetAll: async () => {
      return await dispatch(GameTypesActions.gameTypeGetAll());
    },
    questionTypeGetall: async () => {
      return await dispatch(QuestionTypesActions.questionTypeGetAll());
    },
    gameGetByDisplayId: async (displayId: string) => {
      return await dispatch(GameActions.gameGetByDisplayId(displayId));
    },
    gameUpdate: async (game: Game) => {
      return await dispatch(GameActions.gameUpdate(game));
    },
    gameRemove: async (gameId: string) => {
      return await dispatch(GameActions.gameRemove(gameId));
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
)(withStyles(styles)(withSnackbar(GameCreated)));
