import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router';

import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../../store';
import { GameState } from '../../../store/game/types';
import { UserState } from '../../../store/user/types';
import { Fab } from '@material-ui/core';
import { Game, GameStatus } from '../../../api/classes/game.class';

interface OwnProps {
  openGameModal: () => void;
  openQuestionModal: () => void;
  gameNextAction: () => void;
}

interface DispatchProps {}

interface StateProps {
  gameState: GameState;
  userState: UserState;
}

type Props = StateProps & OwnProps & DispatchProps & RouteComponentProps;

const FabComponent: React.FunctionComponent<Props> = props => {
  const { user } = props.userState;

  const renderNewQuestionFab = () => {
    return <MyButton onClick={props.openQuestionModal} text="New Question" />;
  };

  const renderGameFab = (game: Game) => {
    let text = (() => {
      switch (game.status) {
        case GameStatus.created:
          return 'Start Game';
        case GameStatus.started:
          return 'Next Action';
        case GameStatus.finished:
          return '';
      }
    })();

    return <MyButton onClick={props.gameNextAction} text={text} />;
  };

  const renderNewGameFab = () => {
    return <MyButton onClick={props.openGameModal} text="New Game" />;
  };

  const renderFab = () => {
    const regExQuestions = /questions/;
    const regExGame = /games\/[A-Z0-9]{5,}/;
    const { pathname } = props.location;
    const { game } = props.gameState;

    switch (true) {
      case regExQuestions.test(pathname):
        return renderNewQuestionFab();
      case regExGame.test(pathname):
        if (game) return renderGameFab(game);
        else return renderNewGameFab();
      default:
        return renderNewGameFab();
    }
  };

  if (user) return renderFab();
  else return <></>;
};

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    userState: states.userState,
    gameState: states.gameState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {};
};

export const MyFab = withRouter(
  connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
  )(FabComponent)
);

interface MyButtonProps {
  onClick: () => any;
  text: string;
}

const MyButton = (props: MyButtonProps) => (
  <Fab
    variant="extended"
    className="floating-action-button"
    onClick={props.onClick}
    style={{ zIndex: 10 }}
  >
    {props.text}
  </Fab>
);
