import { Hook, HookContext } from '@feathersjs/feathers';
import * as Validator from 'validate.js';
import { User } from '../classes/user.class';

export function afterAllHook(options = {}): Hook {
  return (context: HookContext) => {
    if (Validator.isArray(context.result)) {
      let oldResults = [...context.result];
      context.result = [];

      console.log(context.result);

      for (let data of oldResults) {
        context.result.push(convertToClass(data));
      }
    } else {
      context.result = convertToClass(context.result);
    }

    return context;
  };
}

function convertToClass(data: any): User {
  if (data instanceof User) return data;
  else return User.fromBack(data);
}
