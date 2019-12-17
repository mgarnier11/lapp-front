import { GameType } from '../../api/classes/gameType.class';

// Use `enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export enum GameTypesActionTypes {
  ACTION_STARTED = '@@gameType/ACTION_STARTED',
  ACTION_FAILURE = '@@gameType/ACTION_FAILURE',
  CREATE = '@@gameType/CREATE',
  UPDATE = '@@gameType/UPDATE',
  REMOVE = '@@gameType/REMOVE',
  GETALL = '@@gameType/GETALL'
}

// Declare state types with `readonly` modifier to get compile time immutability.
// https://github.com/piotrwitek/react-redux-typescript-guide#state-with-type-level-immutability
export interface GameTypesState {
  readonly gameTypes?: GameType[];
  readonly loading: boolean;
}

export const defaultGameTypesState: GameTypesState = { loading: false };
