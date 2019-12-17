// store/session/actions.ts

import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { store } from '../index';
import { RoleActionTypes } from './types';
import apiHandler from '../../api/apiHandler';
import { addError } from '../error/actions';
import { Role, RoleBackModel } from '../../api/classes/role.class';
import { ServiceEvents } from '../../api/services/baseService';

// Action Definition
export interface ActionStarted {
  type: RoleActionTypes.ACTION_STARTED;
}
export interface ActionFailure {
  type: RoleActionTypes.ACTION_FAILURE;
}
export interface Create {
  type: RoleActionTypes.CREATE;
  role: Role;
}
export interface Update {
  type: RoleActionTypes.UPDATE;
  role: Role;
}
export interface Remove {
  type: RoleActionTypes.REMOVE;
  role: Role;
}
export interface GetAll {
  type: RoleActionTypes.GETALL;
  roles: Role[];
}
// Union Action Types
export type Action =
  | ActionStarted
  | ActionFailure
  | Create
  | Update
  | Remove
  | GetAll;

export class RoleActions {
  private binded: boolean = false;
  /**
   *
   */
  constructor() {}

  public bindBaseEvents() {
    if (!this.binded) {
      apiHandler.roleService.featherService.on(
        ServiceEvents.created,
        this.roleCreated
      );
      apiHandler.roleService.featherService.on(
        ServiceEvents.patched,
        this.roleUpdated
      );
      apiHandler.roleService.featherService.on(
        ServiceEvents.removed,
        this.roleRemoved
      );

      this.binded = true;
    } else {
      console.log('cant rebind events');
    }
  }

  public unbindEvents() {
    apiHandler.roleService.featherService.off(
      ServiceEvents.created,
      this.roleCreated
    );
    apiHandler.roleService.featherService.off(
      ServiceEvents.patched,
      this.roleUpdated
    );
    apiHandler.roleService.featherService.off(
      ServiceEvents.removed,
      this.roleRemoved
    );

    this.binded = false;
  }

  private roleCreated(roleModel: RoleBackModel) {
    store.dispatch({
      type: RoleActionTypes.CREATE,
      role: Role.fromBack(roleModel)
    });
  }

  private roleUpdated(roleModel: RoleBackModel) {
    store.dispatch({
      type: RoleActionTypes.UPDATE,
      role: Role.fromBack(roleModel)
    });
  }

  private roleRemoved(roleModel: RoleBackModel) {
    store.dispatch({
      type: RoleActionTypes.REMOVE,
      role: Role.fromBack(roleModel)
    });
  }

  private static roleActionStartedCreator = (): ActionStarted => {
    return {
      type: RoleActionTypes.ACTION_STARTED
    };
  };

  private static roleActionFailureCreator = (): ActionFailure => {
    return {
      type: RoleActionTypes.ACTION_FAILURE
    };
  };

  public static roleCreate = (
    role: Partial<Role>
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(RoleActions.roleActionStartedCreator());
        apiHandler.roleService.featherService
          .create(role)
          .then(role => {
            /*
            dispatch({
              type: RoleActionTypes.CREATE,
              role: role
            });
            */
            apiHandler.roleService.ownEvents.emit(ServiceEvents.created, role);
            resolve(true);
          })
          .catch(error => {
            dispatch(RoleActions.roleActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };

  public static roleUpdate = (
    role: Role
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(RoleActions.roleActionStartedCreator());
        apiHandler.roleService.featherService
          .patch(role.id, role)
          .then(role => {
            /*
          dispatch({
            type: RoleActionTypes.UPDATE,
            role: role
          });
          */
            apiHandler.roleService.ownEvents.emit(ServiceEvents.updated, role);

            resolve(true);
          })
          .catch(error => {
            dispatch(RoleActions.roleActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };

  public static roleRemove = (
    roleId: string
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(RoleActions.roleActionStartedCreator());
        apiHandler.roleService.featherService
          .remove(roleId)
          .then(role => {
            /*
            dispatch({
              type: RoleActionTypes.REMOVE,
              role: role
            });
            */
            apiHandler.roleService.ownEvents.emit(ServiceEvents.removed, role);

            resolve(true);
          })
          .catch(error => {
            dispatch(RoleActions.roleActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };

  public static roleGetAll = (): ThunkAction<
    Promise<boolean>,
    {},
    {},
    AnyAction
  > => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(RoleActions.roleActionStartedCreator());
        apiHandler.roleService.featherService
          .find()
          .then(roles => {
            dispatch({
              type: RoleActionTypes.GETALL,
              roles: roles
            });
            resolve(true);
          })
          .catch(error => {
            dispatch(RoleActions.roleActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };
}

export const roleActionsInstance = new RoleActions();
