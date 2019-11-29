import { combineReducers } from 'redux';
import { Action } from './actions';
import { RoleState, defaultRoleState, RoleActionTypes } from './types';
// States' definition

export interface State {
  role: RoleState;
}

const role = (
  roleState: RoleState = defaultRoleState,
  action: Action
): RoleState => {
  switch (action.type) {
    case RoleActionTypes.ACTION_STARTED: {
      return {
        ...roleState,
        loading: true
      };
    }
    case RoleActionTypes.ACTION_FAILURE: {
      return {
        ...roleState,
        loading: false
      };
    }

    case RoleActionTypes.CREATE: {
      if (roleState.roles) {
        return {
          ...roleState,
          roles: roleState.roles.concat(action.role),
          loading: false
        };
      } else {
        return {
          ...roleState,
          loading: false
        };
      }
    }

    case RoleActionTypes.UPDATE: {
      if (roleState.roles) {
        return {
          ...roleState,
          roles: roleState.roles.map(role =>
            role.id === action.role.id ? action.role : role
          ),
          loading: false
        };
      } else {
        return {
          ...roleState,
          loading: false
        };
      }
    }

    case RoleActionTypes.REMOVE: {
      if (roleState.roles) {
        return {
          ...roleState,
          roles: roleState.roles.filter(role => role.id !== action.role.id),
          loading: false
        };
      } else {
        return {
          ...roleState,
          loading: false
        };
      }
    }

    case RoleActionTypes.GETALL: {
      return {
        ...roleState,
        roles: action.roles,
        loading: false
      };
    }
    default:
      return roleState;
  }
};

export default combineReducers<State>({
  role
});
