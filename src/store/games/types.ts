import { Game } from '../../api/classes/game.class';

// Use `enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export enum GamesActionTypes {
  ACTION_STARTED = '@@games/ACTION_STARTED',
  ACTION_FAILURE = '@@games/ACTION_FAILURE',
  CREATE = '@@games/CREATE',
  UPDATE = '@@games/UPDATE',
  REMOVE = '@@games/REMOVE',
  GETALL = '@@games/GETALL'
}

// Declare state types with `readonly` modifier to get compile time immutability.
// https://github.com/piotrwitek/react-redux-typescript-guide#state-with-type-level-immutability
export interface GamesState {
  readonly games?: Game[];
  readonly loading: boolean;
}

export const defaultGamesState: GamesState = { loading: false };
