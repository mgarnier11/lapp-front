// store/session/actions.ts

import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { store } from '../index';
import { PlayingGameActionTypes } from './types';
import apiHandler from '../../api/apiHandler';
import { addError } from '../error/actions';
import { ServiceEvents } from '../../api/services/baseService';
import { Game } from '../../api/classes/game.class';

// Action Definition
export interface ActionStarted {
  type: PlayingGameActionTypes.ACTION_STARTED;
}
export interface ActionFailure {
  type: PlayingGameActionTypes.ACTION_FAILURE;
}
export interface Get {
  type: PlayingGameActionTypes.GET;
  playingGame: Game;
}
export interface Update {
  type: PlayingGameActionTypes.UPDATE;
  playingGame: Game;
}
// Union Action Types
export type Action = ActionStarted | ActionFailure | Get | Update;

export class PlayingGameActions {
  /**
   *
   */
  constructor() {}

  private static playingGameActionStartedCreator = (): ActionStarted => {
    return {
      type: PlayingGameActionTypes.ACTION_STARTED
    };
  };

  private static playingGameActionFailureCreator = (): ActionFailure => {
    return {
      type: PlayingGameActionTypes.ACTION_FAILURE
    };
  };

  public static playingGameGetById = (
    id: string
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(PlayingGameActions.playingGameActionStartedCreator());
        apiHandler.gameService.featherService
          .get(id)
          .then(playingGame => {
            dispatch({
              type: PlayingGameActionTypes.GET,
              playingGame: playingGame
            });

            resolve(true);
          })
          .catch(error => {
            dispatch(PlayingGameActions.playingGameActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };

  public static playingGameGetByDisplayId = (
    displayId: string
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(PlayingGameActions.playingGameActionStartedCreator());
        apiHandler.gameService
          .findGameByDisplayId(displayId)
          .then(playingGame => {
            dispatch({
              type: PlayingGameActionTypes.GET,
              playingGame: playingGame
            });

            resolve(true);
          })
          .catch(error => {
            dispatch(PlayingGameActions.playingGameActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };
}

export const playingGameActionsInstance = new PlayingGameActions();
