import { combineReducers } from 'redux';
import { Action } from './actions';
import { GlobalState, defaultGlobalState, GlobalActionTypes } from './types';
import { statement } from '@babel/template';
// States' definition

export interface State {
  global: GlobalState;
}

const global = (
  globalState: GlobalState = defaultGlobalState,
  action: Action
): GlobalState => {
  switch (action.type) {
    case GlobalActionTypes.ACTION_STARTED: {
      return {
        ...globalState,
        loading: true
      };
    }

    case GlobalActionTypes.ACTION_FAILURE: {
      console.log('ok');

      return {
        ...globalState,
        loading: false
      };
    }

    case GlobalActionTypes.ADD_ERROR: {
      return {
        ...globalState,
        errors: globalState.errors.concat(action.error)
      };
    }

    case GlobalActionTypes.HANDLE_ERROR: {
      return {
        ...globalState,
        errors: globalState.errors.map(err =>
          err.id === action.id ? { ...err, handled: true } : err
        )
      };
    }
    default:
      return globalState;
  }
};

export default combineReducers<State>({
  global
});
