import { Hook, HookContext } from '@feathersjs/feathers';

import { User } from '../classes/user.class';

export function afterAllHook(options = {}): Hook {
  return async (context: HookContext) => {
    if (context.method === 'find') {
      let newResults = [];

      for (let data of context.result) {
        newResults.push(User.fromBack(data));
      }

      context.result = newResults;
    } else {
      context.result = User.fromBack(context.result);
    }

    return context;
  };
}
