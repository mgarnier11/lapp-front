// store/session/actions.ts
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { UserActionTypes } from './types';
import { LoginCredentials, User } from '../../api/classes/user.class';
import apiHandler from '../../api/apiHandler';
import { addError } from '../errors/actions';
import { ServiceEvents } from '../../api/services/baseService';

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
  user: User;
}
export interface Remove {
  type: UserActionTypes.REMOVE;
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
  | Remove
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
  credentials: LoginCredentials,
  hideSuccess?: boolean
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
          if (!hideSuccess) apiHandler.userservice.ownEvents.emit('logged in');
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
          apiHandler.userservice.ownEvents.emit('registered');
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

export const logout = (): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
  ): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      dispatch(userActionStartedCreator());
      apiHandler
        .logout()
        .then(() => {
          dispatch({ type: UserActionTypes.LOGOUT });
          apiHandler.userservice.ownEvents.emit('logged out');
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

export const relog = (
  dispatchError: boolean
): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
  ): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      dispatch(userActionStartedCreator());
      apiHandler
        .reAuthenticate()
        .then(response => {
          dispatch({
            type: UserActionTypes.RELOG,
            user: response.user
          });
          apiHandler.userservice.ownEvents.emit('logged');
          resolve(true);
        })
        .catch(error => {
          dispatch(userActionFailureCreator());
          if (dispatchError) dispatch(addError(error));
          resolve(false);
        });
    });
  };
};

export const userUpdate = (
  user: User
): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
  ): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      dispatch(userActionStartedCreator());
      apiHandler.roleService.featherService
        .patch(user.id, user)
        .then(user => {
          dispatch({
            type: UserActionTypes.UPDATE,
            user: user
          });

          apiHandler.userservice.ownEvents.emit(ServiceEvents.updated, user);

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

export const userRemove = (
  userId: string
): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
  ): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      dispatch(userActionStartedCreator());
      apiHandler.userservice.featherService
        .remove(userId)
        .then(user => {
          dispatch({
            type: UserActionTypes.REMOVE,
            role: user
          });
          apiHandler.userservice.ownEvents.emit(ServiceEvents.removed, user);

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
