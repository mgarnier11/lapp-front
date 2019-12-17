import { combineReducers } from 'redux';
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
      if (gameState.game) {
        return {
          ...gameState,
          game: gameState.game,
          loading: false
        };
      } else {
        return {
          ...gameState,
          loading: false
        };
      }
    }

    case GameActionTypes.UPDATE: {
      if (gameState.game) {
        return {
          ...gameState,
          game: gameState.game,
          loading: false
        };
      } else {
        return {
          ...gameState,
          loading: false
        };
      }
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
