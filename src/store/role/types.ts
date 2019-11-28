import { Role } from '../../api/classes/role.class';

// Use `enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export enum RoleActionTypes {
  ACTION_STARTED = '@@role/ACTION_STARTED',
  ACTION_FAILURE = '@@role/ACTION_FAILURE',
  CREATE = '@@role/CREATE',
  UPDATE = '@@role/UPDATE',
  REMOVE = '@@role/REMOVE',
  GETALL = '@@role/GETALL'
}

// Declare state types with `readonly` modifier to get compile time immutability.
// https://github.com/piotrwitek/react-redux-typescript-guide#state-with-type-level-immutability
export interface RoleState {
  readonly roles?: Role[];
  readonly loading: boolean;
}

export const defaultRoleState: RoleState = { loading: false };
