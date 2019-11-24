import { Service } from '@feathersjs/feathers';
import { afterAllHook } from '../hooks/question.hooks';
import { Question } from '../classes/question.class';

export function questionServiceExtension(
  service: Service<Question>
): Service<Question> {
  service.hooks({
    after: {
      all: afterAllHook()
    }
  });

  return service;
}
