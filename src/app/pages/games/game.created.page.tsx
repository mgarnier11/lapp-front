import * as lodash from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Container, Grid } from '@material-ui/core';
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
import { Loading } from '../../components/loading/loading.component';
import GameForm from '../../components/game/game.form.component';

const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {
      marginTop: theme.spacing(3)
    }
  });

interface OwnProps {
  displayId?: string;
}

interface DispatchProps {
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

interface ComponentState {}

class GameCreated extends React.Component<Props, ComponentState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  handleSubmit = (game: Game) => {
    console.log('t');

    this.props.gameUpdate(game);
  };

  render() {
    const classes = this.props.classes;

    const game = this.props.gameState.game;

    if (!game) return <Loading />;
    return (
      <Container maxWidth="md" className={classes.root}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <GameForm
              game={game}
              onSubmit={this.handleSubmit}
              buttonText="Update Game"
            />
          </Grid>
          <Grid item xs={12} sm={6}></Grid>
        </Grid>
      </Container>
    );
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
