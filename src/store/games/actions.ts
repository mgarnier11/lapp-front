// store/session/actions.ts

import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { store } from '../index';
import { GamesActionTypes } from './types';
import apiHandler from '../../api/apiHandler';
import { addError } from '../errors/actions';
import { Game, GameBackModel } from '../../api/classes/game.class';
import { ServiceEvents } from '../../api/services/baseService';
import { GameActionTypes } from '../game/types';
import { GameActions } from '../game/actions';

// Action Definition
export interface ActionStarted {
  type: GamesActionTypes.ACTION_STARTED;
}
export interface ActionFailure {
  type: GamesActionTypes.ACTION_FAILURE;
}
export interface Create {
  type: GamesActionTypes.CREATE;
  game: Game;
}
export interface Update {
  type: GamesActionTypes.UPDATE;
  game: Game;
}
export interface Remove {
  type: GamesActionTypes.REMOVE;
  game: Game;
}
export interface GetAll {
  type: GamesActionTypes.GETALL;
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

export class GamesActions {
  private binded: boolean = false;

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
      type: GamesActionTypes.CREATE,
      game: Game.fromBack(gameModel)
    });
  }

  private gameUpdated(gameModel: GameBackModel) {
    const game = Game.fromBack(gameModel);
    const playingGame = store.getState().gameState.game;

    if (playingGame && playingGame.id === game.id) {
      store.dispatch({
        type: GameActionTypes.UPDATE,
        game
      });
    }
    store.dispatch({
      type: GamesActionTypes.UPDATE,
      game
    });
  }

  private gameRemoved(gameModel: GameBackModel) {
    const game = Game.fromBack(gameModel);
    const playingGame = store.getState().gameState.game;

    if (playingGame && playingGame.id === game.id) {
      store.dispatch({
        type: GameActionTypes.REMOVE,
        game
      });
    }
    store.dispatch({
      type: GamesActionTypes.REMOVE,
      game
    });
  }

  private static gameActionStartedCreator = (): ActionStarted => {
    return {
      type: GamesActionTypes.ACTION_STARTED
    };
  };

  private static gameActionFailureCreator = (): ActionFailure => {
    return {
      type: GamesActionTypes.ACTION_FAILURE
    };
  };

  public static gameCreate = (
    game: Partial<Game>,
    hideSuccess?: boolean
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(GamesActions.gameActionStartedCreator());
        apiHandler.gameService.featherService
          .create(game)
          .then(game => {
            if (!hideSuccess)
              apiHandler.gameService.ownEvents.emit(
                ServiceEvents.created,
                game
              );
            resolve(true);
          })
          .catch(error => {
            dispatch(GamesActions.gameActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };

  public static gameUpdate = (
    game: Game,
    hideSuccess?: boolean,
    shouldLoadGame?: boolean
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(GamesActions.gameActionStartedCreator());

        if (shouldLoadGame) dispatch(GameActions.gameStartLoading());

        apiHandler.gameService.featherService
          .patch(game.id, game)
          .then(game => {
            if (!hideSuccess)
              apiHandler.gameService.ownEvents.emit(
                ServiceEvents.updated,
                game
              );

            if (shouldLoadGame) dispatch(GameActions.gameFinishLoading());
            resolve(true);
          })
          .catch(error => {
            dispatch(GamesActions.gameActionFailureCreator());
            dispatch(addError(error));
            if (shouldLoadGame) dispatch(GameActions.gameFinishLoading());
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
        dispatch(GamesActions.gameActionStartedCreator());
        apiHandler.gameService.featherService
          .remove(gameId)
          .then(game => {
            apiHandler.gameService.ownEvents.emit(ServiceEvents.removed, game);

            resolve(true);
          })
          .catch(error => {
            dispatch(GamesActions.gameActionFailureCreator());
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
        dispatch(GamesActions.gameActionStartedCreator());
        apiHandler.gameService.featherService
          .find()
          .then(games => {
            dispatch({
              type: GamesActionTypes.GETALL,
              games: games
            });
            resolve(true);
          })
          .catch(error => {
            console.log(error);

            dispatch(GamesActions.gameActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };

  public static gameGetAllLinked = (
    userId: string
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(GamesActions.gameActionStartedCreator());
        Promise.all([
          apiHandler.gameService.findCreatedGamesPerUser(userId),
          apiHandler.gameService.findGamesPerUser(userId)
        ])
          .then(gamesArrays => {
            let games: Game[] = gamesArrays.flat();
            dispatch({
              type: GamesActionTypes.GETALL,
              games: games.filter(
                (elem, index) =>
                  index === games.findIndex(g => g.id === elem.id)
              )
            });
            resolve(true);
          })
          .catch(error => {
            dispatch(GamesActions.gameActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };
}

export const gamesActionsInstance = new GamesActions();
