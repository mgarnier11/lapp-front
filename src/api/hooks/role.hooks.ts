import { Hook, HookContext } from '@feathersjs/feathers';
import * as Validator from 'validate.js';
import { Role } from '../classes/role.class';

export function afterAllHook(options = {}): Hook {
  return (context: HookContext) => {
    if (Validator.isArray(context.result)) {
      let oldResults = [...context.result];
      context.result = [];

      for (let data of oldResults) {
        context.result.push(convertToClass(data));
      }
    } else {
      context.result = convertToClass(context.result);
    }

    return context;
  };
}

function convertToClass(data: any): Role {
  if (data instanceof Role) return data;
  else return Role.fromBack(data);
}
