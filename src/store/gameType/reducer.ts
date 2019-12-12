import { Action } from './actions';
import {
  GameTypeState,
  defaultGameTypeState,
  GameTypeActionTypes
} from './types';
// States' definition

const gameType = (
  gameTypeState: GameTypeState = defaultGameTypeState,
  action: Action
): GameTypeState => {
  switch (action.type) {
    case GameTypeActionTypes.ACTION_STARTED: {
      return {
        ...gameTypeState,
        loading: true
      };
    }
    case GameTypeActionTypes.ACTION_FAILURE: {
      return {
        ...gameTypeState,
        loading: false
      };
    }

    case GameTypeActionTypes.CREATE: {
      if (gameTypeState.gameTypes) {
        return {
          ...gameTypeState,
          gameTypes: gameTypeState.gameTypes.concat(action.gameType),
          loading: false
        };
      } else {
        return {
          ...gameTypeState,
          loading: false
        };
      }
    }

    case GameTypeActionTypes.UPDATE: {
      if (gameTypeState.gameTypes) {
        return {
          ...gameTypeState,
          gameTypes: gameTypeState.gameTypes.map(gameType =>
            gameType.id === action.gameType.id ? action.gameType : gameType
          ),
          loading: false
        };
      } else {
        return {
          ...gameTypeState,
          loading: false
        };
      }
    }

    case GameTypeActionTypes.REMOVE: {
      if (gameTypeState.gameTypes) {
        return {
          ...gameTypeState,
          gameTypes: gameTypeState.gameTypes.filter(
            gameType => gameType.id !== action.gameType.id
          ),
          loading: false
        };
      } else {
        return {
          ...gameTypeState,
          loading: false
        };
      }
    }

    case GameTypeActionTypes.GETALL: {
      return {
        ...gameTypeState,
        gameTypes: action.gameTypes,
        loading: false
      };
    }
    default:
      return gameTypeState;
  }
};

export default gameType;
