import { Hook, HookContext } from '@feathersjs/feathers';
import * as Validator from 'validate.js';
import { QuestionType } from '../classes/questionType.class';

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

function convertToClass(data: any): QuestionType {
  if (data.constructor.name === QuestionType.name) return data;
  else return QuestionType.fromBack(data);
}
