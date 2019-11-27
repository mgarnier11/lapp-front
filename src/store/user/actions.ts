// store/session/actions.ts
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { UserActionTypes } from './types';
import { LoginCredentials, User } from '../../api/classes/user.class';
import apiHandler from '../../api/apiHandler';
import { actionFailureCreator, actionStartedCreator } from '../global/actions';

// Action Definition
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
export type Action = Login | Logout | Register | Update | Delete | Relog;

// Async Actions
export const login = (
  credentials: LoginCredentials
): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
  ): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      dispatch(actionStartedCreator());
      apiHandler
        .login(credentials)
        .then(response => {
          setTimeout(() => {
            dispatch({
              type: UserActionTypes.LOGIN,
              user: response.user
            });
            resolve(true);
          }, 2500);
        })
        .catch(error => {
          dispatch(actionFailureCreator(error));
          resolve(false);
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
          resolve();
        })
        .catch(error => {
          dispatch(actionFailureCreator(error));
          resolve();
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
          resolve();
        })
        .catch(error => {
          dispatch(actionFailureCreator(error));
          resolve();
        });
    });
  };
};

export const relog = (): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    return new Promise<void>(resolve => {
      apiHandler
        .reAuthenticate()
        .then(response => {
          dispatch({
            type: UserActionTypes.RELOG,
            user: response.user
          });
        })
        .catch(error => {
          console.log(error);
        });
    });
  };
};
