import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Button } from '@material-ui/core';

import { RootState } from '../../../store';
import { LoginCredentials, User } from '../../../api/classes/user.class';
import { register, login } from '../../../store/user/actions';
import { Helper } from '../../../helper';
import { GamesActions } from '../../../store/games/actions';
import { Game } from '../../../api/classes/game.class';
import { QuestionTypesState } from '../../../store/questionTypes/types';
import { GameTypesState } from '../../../store/gameTypes/types';
import { RouterProps, withRouter } from 'react-router';

interface OwnProps { }

interface DispatchProps {
  login: (credentials: LoginCredentials, hideSuccess?: boolean) => Promise<any>;
  register: (userDatas: Partial<User>, hideSuccess?: boolean) => Promise<any>;
  gameCreate: (game: Partial<Game>, hideSuccess?: boolean) => Promise<any>;
}

interface StateProps {
  questionTypesState: QuestionTypesState;
  gameTypesState: GameTypesState;
}

type Props = StateProps & OwnProps & DispatchProps & RouterProps;
interface ComponentState { }

class IdViceComponent extends React.Component<Props, ComponentState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  handleWithoutLoginClick = async () => {
    try {
      await this.loginIDVice();
    } catch (error) {
      await this.registerIDVice();

      await this.loginIDVice();
    }
  };

  registerIDVice = async () => {
    let newUser = await this.props.register(
      { email: Helper.getDeviceId() },
      true
    );
    if (newUser) Helper.saveIDVice(newUser);
  };

  loginIDVice = async () => {
    /*let u = */await this.props.login(Helper.getIDViceCredentials(), true);
    this.props.history.push('/home');
  };

  render() {
    return (
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={this.handleWithoutLoginClick}
      >
        Play with ID-Vice
      </Button>
    );
  }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    questionTypesState: states.questionTypesState,
    gameTypesState: states.gameTypesState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    login: async (credentials: LoginCredentials, hideSuccess?: boolean) => {
      return await dispatch(login(credentials, hideSuccess));
    },
    register: async (userDatas: Partial<User>, hideSuccess?: boolean) => {
      return await dispatch(register(userDatas, hideSuccess));
    },
    gameCreate: async (newGame: Partial<Game>, hideSuccess?: boolean) => {
      return await dispatch(GamesActions.gameCreate(newGame));
    }
  };
};

export const IdVice = withRouter(
  connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { forwardRef: true }
  )(IdViceComponent)
);
