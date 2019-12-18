import React, { ReactChild, ReactPortal, ReactFragment } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  Route,
  Redirect,
  useParams,
  withRouter,
  RouteComponentProps
} from 'react-router-dom';
import { RootState } from '../../../store';
import { Loading } from '../../components/loading/loading.component';
import { GameState } from '../../../store/game/types';
import { GameActions } from '../../../store/game/actions';
import { GameStatus } from '../../../api/classes/game.class';

import GameNotFound from '../../pages/games/game.notFound.page';

interface RouteParams {
  displayId: string;
}

interface OwnProps {}

interface DispatchProps {
  gameGetByDisplayId: (displayId: string) => Promise<any>;
}

interface StateProps {
  gameState: GameState;
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
  }

  componentWillMount() {
    const { displayId } = this.props.match.params as any;
    const { game, loading } = this.props.gameState;

    if (!game && !loading && displayId) {
      this.props.gameGetByDisplayId(displayId);
    }
  }

  render() {
    const { displayId } = this.props.match.params as any;
    const { game, loading } = this.props.gameState;

    if (loading) return <Loading />;
    else if (game) {
      switch (game.status) {
        case GameStatus.created:
          return <>created</>;
        case GameStatus.started:
          return <>started</>;
        case GameStatus.finished:
          return <>finished</>;
      }
    } else {
      return <GameNotFound displayId={displayId} />;
    }
    console.log(game);

    return <>An error occured</>;
  }
}

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
