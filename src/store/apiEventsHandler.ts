import { store } from './index';
import apiHandler from '../api/apiHandler';
import { logout } from './user/actions';
import { UserActionTypes } from './user/types';
import { Role, RoleBackModel } from '../api/classes/role.class';
import { RoleActionTypes } from './role/types';

class ApiEventsHandler {
  /**
   *
   */
  constructor() {}

  bindEvents() {
    apiHandler.roleService.featherService.on('created', this.roleCreated);
    apiHandler.roleService.featherService.on('patched', this.roleUpdated);
    apiHandler.roleService.featherService.on('removed', this.roleRemoved);
  }

  unbindEvents() {
    console.log('unbinded');
  }

  roleCreated(roleModel: RoleBackModel) {
    store.dispatch({
      type: RoleActionTypes.CREATE,
      role: Role.fromBack(roleModel)
    });
  }

  roleUpdated(roleModel: RoleBackModel) {
    store.dispatch({
      type: RoleActionTypes.UPDATE,
      role: Role.fromBack(roleModel)
    });
  }

  roleRemoved(roleModel: RoleBackModel) {
    store.dispatch({
      type: RoleActionTypes.REMOVE,
      role: Role.fromBack(roleModel)
    });
  }
}

export default new ApiEventsHandler();
