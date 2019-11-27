// store/session/actions.ts
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { LoginCredentials, User } from '../../api/classes/user.class';
import apiHandler from '../../api/apiHandler';
import { GlobalActionTypes, MyError } from './types';

// Action Definition
export interface ActionStarted {
  type: GlobalActionTypes.ACTION_STARTED;
}
export interface ActionFailure {
  type: GlobalActionTypes.ACTION_FAILURE;
  error: any;
}
export interface AddError {
  type: GlobalActionTypes.ADD_ERROR;
  error: MyError;
}
export interface HandleError {
  type: GlobalActionTypes.HANDLE_ERROR;
  id: number;
}
// Union Action Types
export type Action = ActionStarted | ActionFailure | AddError | HandleError;

export const actionStartedCreator = (): ActionStarted => {
  return {
    type: GlobalActionTypes.ACTION_STARTED
  };
};

export const addErrorCreator = (error: MyError): AddError => {
  return {
    type: GlobalActionTypes.ADD_ERROR,
    error
  };
};

let ids = 0;

// Async Actions
export const actionFailureCreator = (
  error: any
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    return new Promise<void>(resolve => {
      dispatch(
        addErrorCreator({
          id: ids++,
          date: Date.now(),
          message: error.message,
          code: error.code,
          handled: false
        })
      );
      console.log('patate');

      dispatch({
        type: GlobalActionTypes.ACTION_FAILURE
      });

      resolve();
    });
  };
};

export const handleError = (id: number): HandleError => {
  return {
    type: GlobalActionTypes.HANDLE_ERROR,
    id: id
  };
};
