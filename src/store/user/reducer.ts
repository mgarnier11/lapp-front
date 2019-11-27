import { combineReducers } from 'redux';
import { Action } from './actions';
import { UserState, defaultUserState, UserActionTypes } from './types';
import { statement } from '@babel/template';
// States' definition

export interface State {
  user: UserState;
}

const user = (
  userState: UserState = defaultUserState,
  action: Action
): UserState => {
  switch (action.type) {
    case UserActionTypes.LOGIN: {
      return {
        ...userState,
        user: action.user
      };
    }

    case UserActionTypes.LOGOUT: {
      return {
        ...userState,
        user: undefined
      };
    }

    case UserActionTypes.RELOG: {
      return { ...userState, user: action.user };
    }
    default:
      return userState;
  }
};

export default combineReducers<State>({
  user
});
