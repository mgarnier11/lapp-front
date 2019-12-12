import { combineReducers } from 'redux';
import { Action } from './actions';
import { GameState, defaultGameState, GameActionTypes } from './types';
// States' definition

const game = (
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

    case GameActionTypes.CREATE: {
      if (gameState.games) {
        return {
          ...gameState,
          games: gameState.games.concat(action.game),
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
      if (gameState.games) {
        return {
          ...gameState,
          games: gameState.games.map(game =>
            game.id === action.game.id ? action.game : game
          ),
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
      if (gameState.games) {
        return {
          ...gameState,
          games: gameState.games.filter(game => game.id !== action.game.id),
          loading: false
        };
      } else {
        return {
          ...gameState,
          loading: false
        };
      }
    }

    case GameActionTypes.GETALL: {
      return {
        ...gameState,
        games: action.games,
        loading: false
      };
    }
    default:
      return gameState;
  }
};

export default game;
