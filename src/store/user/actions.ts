// store/session/actions.ts
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { UserActionTypes } from './types';
import { LoginCredentials, User } from '../../api/classes/user.class';
import apiHandler from '../../api/apiHandler';
import { addError } from '../error/actions';

// Action Definition
export interface ActionStarted {
  type: UserActionTypes.ACTION_STARTED;
}
export interface ActionFailure {
  type: UserActionTypes.ACTION_FAILURE;
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
export interface Relog {
  type: UserActionTypes.RELOG;
  user: User;
}

// Union Action Types
export type Action =
  | ActionStarted
  | ActionFailure
  | Login
  | Logout
  | Register
  | Update
  | Delete
  | Relog;

const userActionStartedCreator = (): ActionStarted => {
  return {
    type: UserActionTypes.ACTION_STARTED
  };
};

const userActionFailureCreator = (): ActionFailure => {
  return {
    type: UserActionTypes.ACTION_FAILURE
  };
};

// Async Actions
export const login = (
  credentials: LoginCredentials
): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
  ): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      dispatch(userActionStartedCreator());
      apiHandler
        .login(credentials)
        .then(response => {
          dispatch({
            type: UserActionTypes.LOGIN,
            user: response.user
          });
          resolve(true);
        })
        .catch(error => {
          dispatch(userActionFailureCreator());
          dispatch(addError(error));
          resolve(false);
        });
    });
  };
};

export const register = (
  userDatas: Partial<User>
): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
  ): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      dispatch(userActionStartedCreator());
      apiHandler
        .register(userDatas)
        .then(user => {
          dispatch({
            type: UserActionTypes.REGISTER,
            user
          });

          resolve(true);
        })
        .catch(error => {
          dispatch(userActionFailureCreator());
          dispatch(addError(error));

          resolve(false);
        });
    });
  };
};

export const logout = (): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    return new Promise<void>(resolve => {
      dispatch(userActionStartedCreator());
      apiHandler
        .logout()
        .then(() => {
          dispatch({ type: UserActionTypes.LOGOUT });
        })
        .catch(error => {
          dispatch(userActionFailureCreator());
          dispatch(addError(error));
        })
        .finally(resolve);
    });
  };
};

export const relog = (
  dispatchError: boolean
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    return new Promise<void>(resolve => {
      dispatch(userActionStartedCreator());
      apiHandler
        .reAuthenticate()
        .then(response => {
          dispatch({
            type: UserActionTypes.RELOG,
            user: response.user
          });
        })
        .catch(error => {
          dispatch(userActionFailureCreator());
          if (dispatchError) dispatch(addError(error));
        })
        .finally(resolve);
    });
  };
};
