import React, { useEffect } from 'react';
import { GameState } from '../../../store/game/types';
import { Game, GameStatus } from '../../../api/classes/game.class';
import { RootState } from '../../../store';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { GamesActions } from '../../../store/games/actions';
import { TemplateDisplayLoader } from '../../templates/templateDisplay';
import { Question } from '../../../api/classes/question.class';
import { Loading } from '../../components/utils/loading.component';
import { QuestionsState } from '../../../store/questions/types';
import { GameActions } from '../../../store/game/actions';
import apiHandler from '../../../api/apiHandler';

interface OwnProps {
  displayId?: string;
}

interface DispatchProps {
  gameUpdate: (
    game: Game,
    hideSuccess?: boolean,
    shouldLoadGame?: boolean
  ) => Promise<any>;
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
    if (!playingGame.actualQuestion.id) {
      if (playingGame.pickQuestion(props.questionState.questions!)) {
        props.gameUpdate(playingGame, true, true);
      }
    }

    apiHandler.gameIo.joinGame(playingGame.id);

    return () => {
      apiHandler.gameIo.leaveGame(playingGame.id);
    };
  }, []);

  const onAcceptQuestion = (q: Question) => {
    nextQuestion();
  };

  const onDenyQuestion = (q: Question) => {
    nextQuestion();
  };

  const nextQuestion = () => {
    playingGame.actualTurn++;

    playingGame.pickQuestion(props.questionState.questions!);

    if (playingGame.actualTurn >= playingGame.nbTurns) {
      playingGame.status = GameStatus.finished;
    }

    props.gameUpdate(playingGame, true, true);
  };

  if (props.gameState.loading) {
    return <Loading />;
  } else if (playingGame && playingGame.actualQuestion) {
    return (
      <TemplateDisplayLoader
        templatePath={playingGame.actualQuestion.type.template.clientPath}
        displayProps={{
          playingGame,
          question: playingGame.actualQuestion,
          onAccept: onAcceptQuestion,
          onDeny: onDenyQuestion,
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
    questionState: states.questionsState,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    gameUpdate: async (
      game: Game,
      hideSuccess?: boolean,
      shouldLoadGame?: boolean
    ) => {
      return await dispatch(
        GamesActions.gameUpdate(game, hideSuccess, shouldLoadGame)
      );
    },
    gameRemove: async (gameId: string) => {
      return await dispatch(GamesActions.gameRemove(gameId));
    },
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
