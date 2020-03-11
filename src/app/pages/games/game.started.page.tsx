import React, { useEffect } from 'react';
import { GameState } from '../../../store/game/types';
import { Game } from '../../../api/classes/game.class';
import { RootState } from '../../../store';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { GamesActions } from '../../../store/games/actions';
import { TemplateDisplayLoader } from '../../templates/templateDisplay';
import { Question } from '../../../api/classes/question.class';
import { Loading } from '../../components/utils/loading.component';
import { QuestionsState } from '../../../store/questions/types';

interface OwnProps {
  displayId?: string;
}

interface DispatchProps {
  gameUpdate: (game: Game) => Promise<any>;
  gameRemove: (gameId: string) => Promise<any>;
}

interface StateProps {
  gameState: GameState;
  questionState: QuestionsState;
}

type Props = StateProps & OwnProps & DispatchProps;

const GameStartedPage: React.FunctionComponent<Props> = (props: Props) => {
  const playingGame = props.gameState.game!;

  useEffect(() => {
    console.log(playingGame);

    if (!playingGame.actualQuestion) {
      console.log(playingGame.pickQuestion(props.questionState.questions!));
      props.gameUpdate(playingGame);
    }
  }, []);
  console.log(playingGame);

  if (playingGame && playingGame.actualQuestion) {
    return (
      <TemplateDisplayLoader
        templatePath={'simple'}
        displayProps={{
          playingGame,
          question: playingGame.actualQuestion,
          onAccept: (q: Question) => {
            console.log('Accept', q);
          },
          onDeny: (q: Question) => {
            console.log('DEny', q);
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
    gameState: states.gameState,
    questionState: states.questionsState
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
