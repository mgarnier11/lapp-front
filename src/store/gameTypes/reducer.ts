import { Action } from './actions';
import {
  GameTypesState,
  defaultGameTypesState,
  GameTypesActionTypes
} from './types';
// States' definition

export const gameTypes = (
  gameTypeState: GameTypesState = defaultGameTypesState,
  action: Action
): GameTypesState => {
  switch (action.type) {
    case GameTypesActionTypes.ACTION_STARTED: {
      return {
        ...gameTypeState,
        loading: true
      };
    }
    case GameTypesActionTypes.ACTION_FAILURE: {
      return {
        ...gameTypeState,
        loading: false
      };
    }

    case GameTypesActionTypes.CREATE: {
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

    case GameTypesActionTypes.UPDATE: {
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

    case GameTypesActionTypes.REMOVE: {
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

    case GameTypesActionTypes.GETALL: {
      return {
        ...gameTypeState,
        gameTypes: action.gameTypes,
        loading: false,
        isStarting: false
      };
    }
    default:
      return gameTypeState;
  }
};

export default gameTypes;
