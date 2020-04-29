import { Hook, HookContext } from '@feathersjs/feathers';
import * as Validator from 'validate.js';
import { Question } from '../classes/question.class';

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

export function beforeUpsertHook(options = {}): Hook {
  return (context: HookContext) => {
    console.log(context);
  };
}

function convertToClass(data: any): Question {
  if (data instanceof Question) return data;
  else return Question.fromBack(data);
}
