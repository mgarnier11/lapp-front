import { combineReducers } from 'redux';
import { Action } from './actions';
import { ErrorState, defaultErrorState, ErrorActionTypes } from './types';
// States' definition

export interface State {
  error: ErrorState;
}

const error = (
  errorState: ErrorState = defaultErrorState,
  action: Action
): ErrorState => {
  switch (action.type) {
    case ErrorActionTypes.ADD_ERROR: {
      return {
        ...errorState,
        errors: errorState.errors.concat(action.error)
      };
    }

    case ErrorActionTypes.HANDLE_ERROR: {
      return {
        ...errorState,
        errors: errorState.errors.map(err =>
          err.id === action.id ? { ...err, handled: true } : err
        )
      };
    }
    default:
      return errorState;
  }
};

export default combineReducers<State>({
  error
});
