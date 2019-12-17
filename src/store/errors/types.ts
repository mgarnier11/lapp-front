export interface MyError {
  id: number;
  date: number;
  message: string;
  code: number;
  handled: boolean;
}

// Use `enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export enum ErrorsActionTypes {
  ADD_ERROR = '@@global/ADD_ERROR',
  HANDLE_ERROR = '@@global/HANDLE_ERROR'
}

// Declare state types with `readonly` modifier to get compile time immutability.
// https://github.com/piotrwitek/react-redux-typescript-guide#state-with-type-level-immutability
export interface ErrorsState {
  readonly errors: MyError[];
}

export const defaultErrorsState: ErrorsState = {
  errors: []
};
