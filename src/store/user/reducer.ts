import { Action } from './actions';
import { UserState, defaultUserState, UserActionTypes } from './types';
import apiHandler from '../../api/apiHandler';
// States' definition

export const user = (
  userState: UserState = defaultUserState,
  action: Action
): UserState => {
  switch (action.type) {
    case UserActionTypes.ACTION_STARTED: {
      return {
        ...userState,
        loading: true,
        isNotLogged: false
      };
    }
    case UserActionTypes.ACTION_FAILURE: {
      return {
        ...userState,
        loading: false,
        isNotLogged: false
      };
    }

    case UserActionTypes.LOGIN: {
      return {
        ...userState,
        user: action.user,
        loading: false,
        isNotLogged: action.user.name === 'notLoggedUser'
      };
    }

    case UserActionTypes.REGISTER: {
      return {
        ...userState,
        user: undefined,
        loading: false,
        isNotLogged: false
      };
    }

    case UserActionTypes.LOGOUT: {
      return {
        ...userState,
        user: undefined,
        loading: false,
        isNotLogged: false
      };
    }

    case UserActionTypes.RELOG: {
      return {
        ...userState,
        user: action.user,
        loading: false,
        isNotLogged: action.user.name === 'notLoggedUser'
      };
    }

    case UserActionTypes.UPDATE: {
      return {
        ...userState,
        user: action.user,
        loading: false
      };
    }

    case UserActionTypes.REMOVE: {
      return {
        ...userState,
        user: undefined,
        loading: false
      };
    }

    default:
      return userState;
  }
};

export default user;
