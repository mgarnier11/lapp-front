import { combineReducers } from 'redux';
import { Action } from './actions';
import {
  PlayingGameState,
  defaultPlayingGameState,
  PlayingGameActionTypes
} from './types';
// States' definition

const playingGame = (
  playingGameState: PlayingGameState = defaultPlayingGameState,
  action: Action
): PlayingGameState => {
  switch (action.type) {
    case PlayingGameActionTypes.ACTION_STARTED: {
      return {
        ...playingGameState,
        loading: true
      };
    }
    case PlayingGameActionTypes.ACTION_FAILURE: {
      return {
        ...playingGameState,
        loading: false
      };
    }

    case PlayingGameActionTypes.GET: {
      if (playingGameState.playingGames) {
        return {
          ...playingGameState,
          playingGames: playingGameState.playingGames.concat(
            action.playingGame
          ),
          loading: false
        };
      } else {
        return {
          ...playingGameState,
          loading: false
        };
      }
    }

    case PlayingGameActionTypes.UPDATE: {
      if (playingGameState.playingGames) {
        return {
          ...playingGameState,
          playingGames: playingGameState.playingGames.map(playingGame =>
            playingGame.id === action.playingGame.id
              ? action.playingGame
              : playingGame
          ),
          loading: false
        };
      } else {
        return {
          ...playingGameState,
          loading: false
        };
      }
    }

    case PlayingGameActionTypes.REMOVE: {
      if (playingGameState.playingGames) {
        return {
          ...playingGameState,
          playingGames: playingGameState.playingGames.filter(
            playingGame => playingGame.id !== action.playingGame.id
          ),
          loading: false
        };
      } else {
        return {
          ...playingGameState,
          loading: false
        };
      }
    }

    case PlayingGameActionTypes.GETALL: {
      return {
        ...playingGameState,
        playingGames: action.playingGames,
        loading: false
      };
    }
    default:
      return playingGameState;
  }
};

export default playingGame;
