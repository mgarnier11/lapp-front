import { Action } from './actions';
import { GamesState, defaultGamesState, GamesActionTypes } from './types';
// States' definition

export const games = (
  gameState: GamesState = defaultGamesState,
  action: Action
): GamesState => {
  switch (action.type) {
    case GamesActionTypes.ACTION_STARTED: {
      return {
        ...gameState,
        loading: true
      };
    }
    case GamesActionTypes.ACTION_FAILURE: {
      return {
        ...gameState,
        loading: false
      };
    }

    case GamesActionTypes.CREATE: {
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

    case GamesActionTypes.UPDATE: {
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

    case GamesActionTypes.REMOVE: {
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

    case GamesActionTypes.GETALL: {
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

export default games;
