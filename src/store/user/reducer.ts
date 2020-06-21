import { Action } from './actions';
import { UserState, defaultUserState, UserActionTypes } from './types';
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
        isIDVice: false
      };
    }
    case UserActionTypes.ACTION_FAILURE: {
      return {
        ...userState,
        loading: false,
        isIDVice: false
      };
    }

    case UserActionTypes.LOGIN: {
      return {
        ...userState,
        user: action.user,
        loading: false,
        isIDVice: action.user.isIDVice()
      };
    }

    case UserActionTypes.REGISTER: {
      return {
        ...userState,
        user: undefined,
        loading: false,
        isIDVice: false
      };
    }

    case UserActionTypes.LOGOUT: {
      return {
        ...userState,
        user: undefined,
        loading: false,
        isIDVice: false
      };
    }

    case UserActionTypes.RELOG: {
      return {
        ...userState,
        user: action.user,
        loading: false,
        isIDVice: action.user.isIDVice()
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
