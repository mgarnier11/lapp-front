import { Action } from './actions';
import { ErrorsState, defaultErrorsState, ErrorsActionTypes } from './types';
// States' definition

export const errors = (
  errorState: ErrorsState = defaultErrorsState,
  action: Action
): ErrorsState => {
  switch (action.type) {
    case ErrorsActionTypes.ADD_ERROR: {
      return {
        ...errorState,
        errors: errorState.errors.concat(action.error)
      };
    }

    case ErrorsActionTypes.HANDLE_ERROR: {
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

export default errors;
