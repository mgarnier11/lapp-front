// store/session/actions.ts
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { RoleActionTypes } from './types';
import apiHandler from '../../api/apiHandler';
import { addError } from '../error/actions';
import { Role } from '../../api/classes/role.class';

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

const roleActionStartedCreator = (): ActionStarted => {
  return {
    type: RoleActionTypes.ACTION_STARTED
  };
};

const roleActionFailureCreator = (): ActionFailure => {
  return {
    type: RoleActionTypes.ACTION_FAILURE
  };
};

// Async Actions
export const roleCreate = (
  role: Partial<Role>
): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
  ): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      dispatch(roleActionStartedCreator());
      apiHandler.roleService.featherService
        .create(role)
        .then(role => {
          dispatch({
            type: RoleActionTypes.CREATE,
            role: role
          });
          resolve(true);
        })
        .catch(error => {
          dispatch(roleActionFailureCreator());
          dispatch(addError(error));
          resolve(false);
        });
    });
  };
};

export const roleUpdate = (
  role: Role
): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
  ): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      dispatch(roleActionStartedCreator());
      apiHandler.roleService.featherService
        .update(role.id, role)
        .then(role => {
          console.log(role);

          dispatch({
            type: RoleActionTypes.UPDATE,
            role: role
          });
          resolve(true);
        })
        .catch(error => {
          dispatch(roleActionFailureCreator());
          dispatch(addError(error));
          resolve(false);
        });
    });
  };
};

export const roleRemove = (
  roleId: string
): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
  ): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      dispatch(roleActionStartedCreator());
      apiHandler.roleService.featherService
        .remove(roleId)
        .then(role => {
          dispatch({
            type: RoleActionTypes.REMOVE,
            role: role
          });
          resolve(true);
        })
        .catch(error => {
          dispatch(roleActionFailureCreator());
          dispatch(addError(error));
          resolve(false);
        });
    });
  };
};

export const roleGetAll = (): ThunkAction<
  Promise<boolean>,
  {},
  {},
  AnyAction
> => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
  ): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      dispatch(roleActionStartedCreator());
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
          dispatch(roleActionFailureCreator());
          dispatch(addError(error));
          resolve(false);
        });
    });
  };
};
