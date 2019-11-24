import { Hook, HookContext } from '@feathersjs/feathers';

import { QuestionType } from '../classes/questionType.class';

export function afterAllHook(options = {}): Hook {
  return async (context: HookContext) => {
    if (context.method === 'find') {
      let newResults = [];

      for (let data of context.result) {
        newResults.push(QuestionType.fromBack(data));
      }

      context.result = newResults;
    } else {
      context.result = QuestionType.fromBack(context.result);
    }
    return context;
  };
}
