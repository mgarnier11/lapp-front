import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, withRouter } from 'react-router';
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

interface State {}

class FabComponent extends React.Component<Props, State> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  renderNewQuestionFab() {
    return (
      <MyButton onClick={this.props.openQuestionModal} text="New Question" />
    );
  }

  renderGameFab(game: Game) {
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

    return <MyButton onClick={this.props.gameNextAction} text={text} />;
  }

  renderNewGameFab() {
    return <MyButton onClick={this.props.openGameModal} text="New Game" />;
  }

  renderFab() {
    const regExQuestions = /questions/;
    const regExGame = /games\/[A-Z0-9]{5,}/;
    const { pathname } = this.props.location;
    const { game } = this.props.gameState;

    switch (true) {
      case regExQuestions.test(pathname):
        return this.renderNewQuestionFab();
      case regExGame.test(pathname):
        if (game) return this.renderGameFab(game);
        else return this.renderNewGameFab();
      default:
        return this.renderNewGameFab();
    }
  }

  render() {
    const { user } = this.props.userState;

    if (user) return this.renderFab();
    else return <></>;
  }
}

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
    color="primary"
    onClick={props.onClick}
    style={{ zIndex: 10 }}
  >
    {props.text}
  </Fab>
);
