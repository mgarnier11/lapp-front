// store/session/actions.ts

import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { store } from '../index';
import { GameActionTypes } from './types';
import apiHandler from '../../api/apiHandler';
import { addError } from '../error/actions';
import { Game, GameBackModel } from '../../api/classes/game.class';
import { ServiceEvents } from '../../api/services/baseService';

// Action Definition
export interface ActionStarted {
  type: GameActionTypes.ACTION_STARTED;
}
export interface ActionFailure {
  type: GameActionTypes.ACTION_FAILURE;
}
export interface Create {
  type: GameActionTypes.CREATE;
  game: Game;
}
export interface Update {
  type: GameActionTypes.UPDATE;
  game: Game;
}
export interface Remove {
  type: GameActionTypes.REMOVE;
  game: Game;
}
export interface GetAll {
  type: GameActionTypes.GETALL;
  games: Game[];
}
// Union Action Types
export type Action =
  | ActionStarted
  | ActionFailure
  | Create
  | Update
  | Remove
  | GetAll;

export class GameActions {
  private binded: boolean = false;
  /**
   *
   */
  constructor() {}

  public bindBaseEvents() {
    if (!this.binded) {
      apiHandler.gameService.featherService.on(
        ServiceEvents.created,
        this.gameCreated
      );
      apiHandler.gameService.featherService.on(
        ServiceEvents.patched,
        this.gameUpdated
      );
      apiHandler.gameService.featherService.on(
        ServiceEvents.removed,
        this.gameRemoved
      );

      this.binded = true;
    } else {
      console.log('cant rebind events');
    }
  }

  public unbindEvents() {
    apiHandler.gameService.featherService.off(
      ServiceEvents.created,
      this.gameCreated
    );
    apiHandler.gameService.featherService.off(
      ServiceEvents.patched,
      this.gameUpdated
    );
    apiHandler.gameService.featherService.off(
      ServiceEvents.removed,
      this.gameRemoved
    );

    this.binded = false;
  }

  private gameCreated(gameModel: GameBackModel) {
    store.dispatch({
      type: GameActionTypes.CREATE,
      game: Game.fromBack(gameModel)
    });
  }

  private gameUpdated(gameModel: GameBackModel) {
    store.dispatch({
      type: GameActionTypes.UPDATE,
      game: Game.fromBack(gameModel)
    });
  }

  private gameRemoved(gameModel: GameBackModel) {
    store.dispatch({
      type: GameActionTypes.REMOVE,
      game: Game.fromBack(gameModel)
    });
  }

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

  public static gameCreate = (
    game: Partial<Game>
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(GameActions.gameActionStartedCreator());
        apiHandler.gameService.featherService
          .create(game)
          .then(game => {
            /*
            dispatch({
              type: GameActionTypes.CREATE,
              game: game
            });
            */
            apiHandler.gameService.ownEvents.emit(ServiceEvents.created, game);
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

  public static gameUpdate = (
    game: Game
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(GameActions.gameActionStartedCreator());
        apiHandler.gameService.featherService
          .patch(game.id, game)
          .then(game => {
            /*
          dispatch({
            type: GameActionTypes.UPDATE,
            game: game
          });
          */
            apiHandler.gameService.ownEvents.emit(ServiceEvents.updated, game);

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

  public static gameRemove = (
    gameId: string
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(GameActions.gameActionStartedCreator());
        apiHandler.gameService.featherService
          .remove(gameId)
          .then(game => {
            /*
            dispatch({
              type: GameActionTypes.REMOVE,
              game: game
            });
            */
            apiHandler.gameService.ownEvents.emit(ServiceEvents.removed, game);

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

  public static gameGetAll = (): ThunkAction<
    Promise<boolean>,
    {},
    {},
    AnyAction
  > => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(GameActions.gameActionStartedCreator());
        apiHandler.gameService.featherService
          .find()
          .then(games => {
            dispatch({
              type: GameActionTypes.GETALL,
              games: games
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
