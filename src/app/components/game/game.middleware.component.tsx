import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { RootState } from '../../../store';
import { Loading } from '../../components/loading/loading.component';
import { GameState } from '../../../store/game/types';
import { GameActions } from '../../../store/game/actions';
import { GameStatus } from '../../../api/classes/game.class';
import GameCreated from '../../pages/games/game.created.page';

import GameNotFound from '../../pages/games/game.notFound.page';
import { UserState } from '../../../store/user/types';

interface RouteParams {
  displayId: string;
}

interface OwnProps {}

interface DispatchProps {
  gameGetByDisplayId: (displayId: string) => Promise<any>;
}

interface StateProps {
  gameState: GameState;
  userState: UserState;
}

type Props = StateProps & OwnProps & DispatchProps & RouteComponentProps;

interface ComponentState {}

class GameMiddleware extends React.Component<Props, ComponentState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {};

    const { displayId } = this.props.match.params as any;
    const { game, loading } = this.props.gameState;

    if (!game && !loading && displayId) {
      this.props.gameGetByDisplayId(displayId);
    }
  }

  render() {
    const { displayId } = this.props.match.params as any;
    const { game, loading: gameLoading } = this.props.gameState;
    const { user, loading: userLoading } = this.props.userState;

    if (game && user) {
      if (
        game.creator.id === user.id ||
        game.users.map(u => u.id).includes(user.id)
      ) {
        switch (game.status) {
          case GameStatus.created:
            return <GameCreated displayId={displayId} />;
          case GameStatus.started:
            return <>started</>;
          case GameStatus.finished:
            return <>finished</>;
        }
      } else {
        return <GameNotFound displayId={displayId} />;
      }
    } else if (gameLoading || userLoading) return <Loading />;
    else if (!game) return <GameNotFound displayId={displayId} />;
    return <>An error occured</>;
  }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    gameState: states.gameState,
    userState: states.userState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    gameGetByDisplayId: async (displayId: string) => {
      dispatch(GameActions.gameGetByDisplayId(displayId));
    }
  };
};

export default withRouter(
  connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
  )(GameMiddleware)
);
