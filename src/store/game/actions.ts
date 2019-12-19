// store/session/actions.ts

import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { GameActionTypes } from './types';
import apiHandler from '../../api/apiHandler';
import { addError } from '../errors/actions';
import { Game } from '../../api/classes/game.class';

// Action Definition
export interface ActionStarted {
  type: GameActionTypes.ACTION_STARTED;
}
export interface ActionFailure {
  type: GameActionTypes.ACTION_FAILURE;
}
export interface Get {
  type: GameActionTypes.GET;
  game: Game;
}
export interface Update {
  type: GameActionTypes.UPDATE;
  game: Game;
}
export interface Remove {
  type: GameActionTypes.REMOVE;
}

// Union Action Types
export type Action = ActionStarted | ActionFailure | Get | Update | Remove;

export class GameActions {
  private static gameActionStartedCreator = (): ActionStarted => {
    return {
      type: GameActionTypes.ACTION_STARTED
    };
  };

  private static gameActionFailureCreator = (): ActionFailure => {
    return {
      type: GameActionTypes.ACTION_FAILURE
    };
  };

  public static gameGetById = (
    id: string
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(GameActions.gameActionStartedCreator());
        apiHandler.gameService.featherService
          .get(id)
          .then(game => {
            dispatch({
              type: GameActionTypes.GET,
              game: game
            });

            resolve(true);
          })
          .catch(error => {
            dispatch(GameActions.gameActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };

  public static gameGetByDisplayId = (
    displayId: string
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(GameActions.gameActionStartedCreator());
        apiHandler.gameService
          .findGameByDisplayId(displayId)
          .then(game => {
            dispatch({
              type: GameActionTypes.GET,
              game: game
            });

            resolve(true);
          })
          .catch(error => {
            dispatch(GameActions.gameActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };
}

export const gameActionsInstance = new GameActions();
