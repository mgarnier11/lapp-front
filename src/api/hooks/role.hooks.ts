import { Hook, HookContext } from '@feathersjs/feathers';

import { Role } from '../classes/role.class';

export function afterAllHook(options = {}): Hook {
  return async (context: HookContext) => {
    if (context.method === 'find') {
      let newResults = [];

      for (let data of context.result) {
        newResults.push(Role.fromBack(data));
      }

      context.result = newResults;
    } else {
      context.result = Role.fromBack(context.result);
    }
    return context;
  };
}
