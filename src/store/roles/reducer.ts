import { Action } from './actions';
import { RolesState, defaultRolesState, RolesActionTypes } from './types';
// States' definition

export const roles = (
  roleState: RolesState = defaultRolesState,
  action: Action
): RolesState => {
  switch (action.type) {
    case RolesActionTypes.ACTION_STARTED: {
      return {
        ...roleState,
        loading: true
      };
    }
    case RolesActionTypes.ACTION_FAILURE: {
      return {
        ...roleState,
        loading: false
      };
    }

    case RolesActionTypes.CREATE: {
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

    case RolesActionTypes.UPDATE: {
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

    case RolesActionTypes.REMOVE: {
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

    case RolesActionTypes.GETALL: {
      return {
        ...roleState,
        roles: action.roles,
        loading: false,
        isStarting: false
      };
    }
    default:
      return roleState;
  }
};

export default roles;
