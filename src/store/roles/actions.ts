// store/session/actions.ts

import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { store } from '../index';
import { RolesActionTypes } from './types';
import apiHandler from '../../api/apiHandler';
import { addError } from '../errors/actions';
import { Role, RoleBackModel } from '../../api/classes/role.class';
import { ServiceEvents } from '../../api/services/baseService';

// Action Definition
export interface ActionStarted {
  type: RolesActionTypes.ACTION_STARTED;
}
export interface ActionFailure {
  type: RolesActionTypes.ACTION_FAILURE;
}
export interface Create {
  type: RolesActionTypes.CREATE;
  role: Role;
}
export interface Update {
  type: RolesActionTypes.UPDATE;
  role: Role;
}
export interface Remove {
  type: RolesActionTypes.REMOVE;
  role: Role;
}
export interface GetAll {
  type: RolesActionTypes.GETALL;
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

export class RolesActions {
  private binded: boolean = false;

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
      type: RolesActionTypes.CREATE,
      role: Role.fromBack(roleModel)
    });
  }

  private roleUpdated(roleModel: RoleBackModel) {
    store.dispatch({
      type: RolesActionTypes.UPDATE,
      role: Role.fromBack(roleModel)
    });
  }

  private roleRemoved(roleModel: RoleBackModel) {
    store.dispatch({
      type: RolesActionTypes.REMOVE,
      role: Role.fromBack(roleModel)
    });
  }

  private static rolesActionStartedCreator = (): ActionStarted => {
    return {
      type: RolesActionTypes.ACTION_STARTED
    };
  };

  private static rolesActionFailureCreator = (): ActionFailure => {
    return {
      type: RolesActionTypes.ACTION_FAILURE
    };
  };

  public static roleCreate = (
    role: Partial<Role>
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(RolesActions.rolesActionStartedCreator());
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
            dispatch(RolesActions.rolesActionFailureCreator());
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
        dispatch(RolesActions.rolesActionStartedCreator());
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
            dispatch(RolesActions.rolesActionFailureCreator());
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
        dispatch(RolesActions.rolesActionStartedCreator());
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
            dispatch(RolesActions.rolesActionFailureCreator());
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
        dispatch(RolesActions.rolesActionStartedCreator());
        apiHandler.roleService.featherService
          .find()
          .then(roles => {
            dispatch({
              type: RolesActionTypes.GETALL,
              roles: roles
            });
            resolve(true);
          })
          .catch(error => {
            console.log(error);

            dispatch(RolesActions.rolesActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };
}

export const roleActionsInstance = new RolesActions();
