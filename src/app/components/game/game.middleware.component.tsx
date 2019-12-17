import React, { ReactChild, ReactPortal, ReactFragment } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Route, Redirect } from 'react-router-dom';
import { RootState } from '../../../store';
import { Loading } from '../../components/loading/loading.component';
import { GameState } from '../../../store/game/types';
import { GameActions } from '../../../store/game/actions';

interface OwnProps {
  displayId?: string;
}

interface DispatchProps {
  gameGetByDisplayId: (displayId: string) => Promise<any>;
}

interface StateProps {
  gameState: GameState;
}

type Props = StateProps & OwnProps & DispatchProps;

const GameMiddleware: React.FunctionComponent<Props> = (props: Props) => {
  console.log(props.displayId);

  let { game, loading } = props.gameState;
  //const classes = useStyles();

  return loading ? <Loading /> : <Loading />;
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
    gameGetByDisplayId: async (displayId: string) => {
      dispatch(GameActions.gameGetByDisplayId(displayId));
    }
  };
};

export default connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps
)(GameMiddleware);
