// store/session/actions.ts
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { UserActionTypes } from './types';
import { LoginCredentials, User } from '../../api/classes/user.class';
import apiHandler from '../../api/apiHandler';

// Action Definition
export interface ActionStarted {
  type: UserActionTypes.ACTION_STARTED;
}
export interface ActionFailure {
  type: UserActionTypes.ACTION_FAILURE;
  error: any;
}
export interface Login {
  type: UserActionTypes.LOGIN;
  user: User;
}
export interface Logout {
  type: UserActionTypes.LOGOUT;
}
export interface Register {
  type: UserActionTypes.REGISTER;
}
export interface Update {
  type: UserActionTypes.UPDATE;
  userDatas: Partial<User>;
}
export interface Delete {
  type: UserActionTypes.DELETE;
}

// Union Action Types
//export type Action =  Login | Logout | Register;

const actionStartedCreator = (): ActionStarted => {
  return {
    type: UserActionTypes.ACTION_STARTED
  };
};

const actionFailureCreator = (error: any): ActionFailure => {
  return {
    type: UserActionTypes.ACTION_FAILURE,
    error
  };
};

// Async Actions
export const login = (
  credentials: LoginCredentials
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    return new Promise<void>(resolve => {
      dispatch(actionStartedCreator());
      apiHandler
        .login(credentials)
        .then(response => {
          dispatch({
            type: UserActionTypes.LOGIN,
            user: User.fromBack(response.user)
          });
        })
        .catch(error => {
          dispatch(actionFailureCreator(error));
        });
    });
  };
};

export const register = (
  userDatas: Partial<User>
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    return new Promise<void>(resolve => {
      dispatch(actionStartedCreator());
      apiHandler
        .register(userDatas)
        .then(user => {
          dispatch({
            type: UserActionTypes.REGISTER,
            user
          });
        })
        .catch(error => {
          dispatch(actionFailureCreator(error));
        });
    });
  };
};

export const logout = (): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    return new Promise<void>(resolve => {
      dispatch(actionStartedCreator());
      apiHandler
        .logout()
        .then(() => {
          dispatch({ type: UserActionTypes.LOGOUT });
        })
        .catch(error => {
          dispatch(actionFailureCreator(error));
        });
    });
  };
};
