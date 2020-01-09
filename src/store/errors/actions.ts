// store/session/actions.ts
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { ErrorsActionTypes, MyError } from './types';

// Action Definition
export interface AddError {
  type: ErrorsActionTypes.ADD_ERROR;
  error: MyError;
}
export interface HandleError {
  type: ErrorsActionTypes.HANDLE_ERROR;
  id: number;
}
// Union Action Types
export type Action = AddError | HandleError;

let ids = 0;

// Async Actions
export const addError = (
  error: any
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    return new Promise<void>(resolve => {
      dispatch({
        type: ErrorsActionTypes.ADD_ERROR,
        error: {
          id: ids++,
          date: Date.now(),
          message: error.message,
          code: error.code,
          handled: false
        }
      });
      resolve();
    });
  };
};

export const handleError = (id: number): HandleError => {
  return {
    type: ErrorsActionTypes.HANDLE_ERROR,
    id: id
  };
};
