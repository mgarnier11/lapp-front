// store/session/actions.ts

import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { store } from '../index';
import { GameTypeActionTypes } from './types';
import apiHandler from '../../api/apiHandler';
import { addError } from '../error/actions';
import { GameType, GameTypeBackModel } from '../../api/classes/gameType.class';
import { ServiceEvents } from '../../api/services/baseService';

// Action Definition
export interface ActionStarted {
  type: GameTypeActionTypes.ACTION_STARTED;
}
export interface ActionFailure {
  type: GameTypeActionTypes.ACTION_FAILURE;
}
export interface Create {
  type: GameTypeActionTypes.CREATE;
  gameType: GameType;
}
export interface Update {
  type: GameTypeActionTypes.UPDATE;
  gameType: GameType;
}
export interface Remove {
  type: GameTypeActionTypes.REMOVE;
  gameType: GameType;
}
export interface GetAll {
  type: GameTypeActionTypes.GETALL;
  gameTypes: GameType[];
}
// Union Action Types
export type Action =
  | ActionStarted
  | ActionFailure
  | Create
  | Update
  | Remove
  | GetAll;

export class GameTypeActions {
  private binded: boolean = false;
  /**
   *
   */
  constructor() {}

  public bindBaseEvents() {
    if (!this.binded) {
      apiHandler.gameTypeService.featherService.on(
        ServiceEvents.created,
        this.gameTypeCreated
      );
      apiHandler.gameTypeService.featherService.on(
        ServiceEvents.patched,
        this.gameTypeUpdated
      );
      apiHandler.gameTypeService.featherService.on(
        ServiceEvents.removed,
        this.gameTypeRemoved
      );

      this.binded = true;
    } else {
      console.log('cant rebind events');
    }
  }

  public unbindEvents() {
    apiHandler.gameTypeService.featherService.off(
      ServiceEvents.created,
      this.gameTypeCreated
    );
    apiHandler.gameTypeService.featherService.off(
      ServiceEvents.patched,
      this.gameTypeUpdated
    );
    apiHandler.gameTypeService.featherService.off(
      ServiceEvents.removed,
      this.gameTypeRemoved
    );

    this.binded = false;
  }

  private gameTypeCreated(gameTypeModel: GameTypeBackModel) {
    store.dispatch({
      type: GameTypeActionTypes.CREATE,
      gameType: GameType.fromBack(gameTypeModel)
    });
  }

  private gameTypeUpdated(gameTypeModel: GameTypeBackModel) {
    store.dispatch({
      type: GameTypeActionTypes.UPDATE,
      gameType: GameType.fromBack(gameTypeModel)
    });
  }

  private gameTypeRemoved(gameTypeModel: GameTypeBackModel) {
    store.dispatch({
      type: GameTypeActionTypes.REMOVE,
      gameType: GameType.fromBack(gameTypeModel)
    });
  }

  private static gameTypeActionStartedCreator = (): ActionStarted => {
    return {
      type: GameTypeActionTypes.ACTION_STARTED
    };
  };

  private static gameTypeActionFailureCreator = (): ActionFailure => {
    return {
      type: GameTypeActionTypes.ACTION_FAILURE
    };
  };

  public static gameTypeCreate = (
    gameType: Partial<GameType>
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(GameTypeActions.gameTypeActionStartedCreator());
        apiHandler.gameTypeService.featherService
          .create(gameType)
          .then(gameType => {
            /*
            dispatch({
              type: GameTypeActionTypes.CREATE,
              gameType: gameType
            });
            */
            apiHandler.gameTypeService.ownEvents.emit(
              ServiceEvents.created,
              gameType
            );
            resolve(true);
          })
          .catch(error => {
            dispatch(GameTypeActions.gameTypeActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };

  public static gameTypeUpdate = (
    gameType: GameType
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(GameTypeActions.gameTypeActionStartedCreator());
        apiHandler.gameTypeService.featherService
          .patch(gameType.id, gameType)
          .then(gameType => {
            /*
          dispatch({
            type: GameTypeActionTypes.UPDATE,
            gameType: gameType
          });
          */
            apiHandler.gameTypeService.ownEvents.emit(
              ServiceEvents.updated,
              gameType
            );

            resolve(true);
          })
          .catch(error => {
            dispatch(GameTypeActions.gameTypeActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };

  public static gameTypeRemove = (
    gameTypeId: string
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(GameTypeActions.gameTypeActionStartedCreator());
        apiHandler.gameTypeService.featherService
          .remove(gameTypeId)
          .then(gameType => {
            /*
            dispatch({
              type: GameTypeActionTypes.REMOVE,
              gameType: gameType
            });
            */
            apiHandler.gameTypeService.ownEvents.emit(
              ServiceEvents.removed,
              gameType
            );

            resolve(true);
          })
          .catch(error => {
            dispatch(GameTypeActions.gameTypeActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };

  public static gameTypeGetAll = (): ThunkAction<
    Promise<boolean>,
    {},
    {},
    AnyAction
  > => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(GameTypeActions.gameTypeActionStartedCreator());
        apiHandler.gameTypeService.featherService
          .find()
          .then(gameTypes => {
            dispatch({
              type: GameTypeActionTypes.GETALL,
              gameTypes: gameTypes
            });
            resolve(true);
          })
          .catch(error => {
            dispatch(GameTypeActions.gameTypeActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };
}

export const gameTypeActionsInstance = new GameTypeActions();
