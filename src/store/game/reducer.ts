import { Action } from './actions';
import { GameState, defaultGameState, GameActionTypes } from './types';
// States' definition

export const game = (
  gameState: GameState = defaultGameState,
  action: Action
): GameState => {
  switch (action.type) {
    case GameActionTypes.ACTION_STARTED: {
      return {
        ...gameState,
        game: undefined,
        loading: true
      };
    }
    case GameActionTypes.ACTION_FAILURE: {
      return {
        ...gameState,
        loading: false
      };
    }

    case GameActionTypes.GET: {
      return {
        ...gameState,
        game: action.game,
        loading: false
      };
    }

    case GameActionTypes.UPDATE: {
      return {
        ...gameState,
        game: action.game,
        loading: false
      };
    }

    case GameActionTypes.REMOVE: {
      return {
        ...gameState,
        game: undefined,
        loading: false
      };
    }
    default:
      return gameState;
  }
};

export default game;
