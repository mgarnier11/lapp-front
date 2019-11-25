import { User } from '../../api/classes/user.class';

// Use `enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export enum UserActionTypes {
  ACTION_STARTED = '@@user/ACTION_STARTED',
  ACTION_FAILURE = '@@user/ACTION_FAILURE',

  LOGIN = '@@user/LOGIN',
  LOGOUT = '@@user/LOGOUT',
  REGISTER = '@@user/REGISTER',
  DELETE = '@@user/DELETE',
  UPDATE = '@@user/UPDATE'
}

// Declare state types with `readonly` modifier to get compile time immutability.
// https://github.com/piotrwitek/react-redux-typescript-guide#state-with-type-level-immutability
export interface AuthState {
  readonly loading: boolean;
  readonly user: User | undefined;
}
