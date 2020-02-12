import React from 'react';
import { GameState } from '../../../store/game/types';
import { Game } from '../../../api/classes/game.class';
import { RootState } from '../../../store';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { GamesActions } from '../../../store/games/actions';
import { TemplateDisplayLoader } from '../../templates/templateDisplay';
import { Question } from '../../../api/classes/question.class';
import { Loading } from '../../components/utils/loading.component';

interface OwnProps {
  displayId?: string;
}

interface DispatchProps {
  gameUpdate: (game: Game) => Promise<any>;
  gameRemove: (gameId: string) => Promise<any>;
}

interface StateProps {
  gameState: GameState;
}

type Props = StateProps & OwnProps & DispatchProps;

const GameStartedPage: React.FunctionComponent<Props> = (props: Props) => {
  const playingGame = props.gameState.game!;

  if (playingGame) {
    return (
      <TemplateDisplayLoader
        templatePath={'simple'}
        displayProps={{
          playingGame,
          question: Question.New({
            difficulty: 5,
            hotLevel: 5,
            text: 'Patate'
          }),
          onAccept: (q: Question) => {
            console.log(q);
          },
          onDeny: (q: Question) => {
            console.log(q);
          }
        }}
      />
    );
  } else {
    return <Loading />;
  }
};

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    gameState: states.gameState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    gameUpdate: async (game: Game) => {
      return await dispatch(GamesActions.gameUpdate(game));
    },
    gameRemove: async (gameId: string) => {
      return await dispatch(GamesActions.gameRemove(gameId));
    }
  };
};

export const GameStarted = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  RootState
>(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
  GameStartedPage
);
