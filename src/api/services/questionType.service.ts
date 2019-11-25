import { Service } from '@feathersjs/feathers';
import { afterAllHook } from '../hooks/questionType.hooks';
import { QuestionType } from '../classes/questionType.class';

export class QuestionTypeService {
  public featherService: Service<QuestionType>;

  /**
   *
   */
  constructor(service: Service<QuestionType>) {
    this.featherService = service;

    this.featherService.hooks({
      after: {
        all: afterAllHook()
      }
    });
  }
}
