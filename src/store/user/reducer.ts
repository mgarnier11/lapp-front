import { combineReducers } from 'redux';
import { Action } from './actions';
import { UserState, defaultUserState, UserActionTypes } from './types';
import apiHandler from '../../api/apiHandler';
// States' definition

const user = (
  userState: UserState = defaultUserState,
  action: Action
): UserState => {
  switch (action.type) {
    case UserActionTypes.ACTION_STARTED: {
      return {
        ...userState,
        loading: true
      };
    }
    case UserActionTypes.ACTION_FAILURE: {
      return {
        ...userState,
        loading: false
      };
    }

    case UserActionTypes.LOGIN: {
      return {
        ...userState,
        user: action.user,
        loading: false
      };
    }

    case UserActionTypes.LOGOUT: {
      apiHandler.userservice.ownEvents.emit('logged out');

      return {
        ...userState,
        user: undefined,
        loading: false
      };
    }

    case UserActionTypes.RELOG: {
      return {
        ...userState,
        user: action.user,
        loading: false
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
