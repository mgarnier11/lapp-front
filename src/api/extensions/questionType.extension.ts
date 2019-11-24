import { Service } from '@feathersjs/feathers';
import { afterAllHook } from '../hooks/questionType.hooks';
import { QuestionType } from '../classes/questionType.class';

export function questionTypeServiceExtension(
  service: Service<QuestionType>
): Service<QuestionType> {
  service.hooks({
    after: {
      all: afterAllHook()
    }
  });

  return service;
}
