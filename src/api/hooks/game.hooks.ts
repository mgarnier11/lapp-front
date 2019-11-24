import { Hook, HookContext } from '@feathersjs/feathers';

import { Game } from '../classes/game.class';

export function afterAllHook(options = {}): Hook {
  return async (context: HookContext) => {
    if (context.method === 'find') {
      let newResults = [];

      for (let data of context.result) {
        newResults.push(Game.fromBack(data));
      }

      context.result = newResults;
    } else {
      context.result = Game.fromBack(context.result);
    }
    return context;
  };
}
