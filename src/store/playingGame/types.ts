import { Game } from '../../api/classes/game.class';

// Use `enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export enum PlayingGameActionTypes {
  ACTION_STARTED = '@@playingGame/ACTION_STARTED',
  ACTION_FAILURE = '@@playingGame/ACTION_FAILURE',
  GET = '@@playingGame/GET',
  UPDATE = '@@playingGame/UPDATE'
}

// Declare state types with `readonly` modifier to get compile time immutability.
// https://github.com/piotrwitek/react-redux-typescript-guide#state-with-type-level-immutability
export interface PlayingGameState {
  readonly playingGame?: Game;
  readonly loading: boolean;
}

export const defaultPlayingGameState: PlayingGameState = { loading: false };
