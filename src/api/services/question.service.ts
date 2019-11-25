import { Service } from '@feathersjs/feathers';
import { afterAllHook } from '../hooks/question.hooks';
import { Question } from '../classes/question.class';

export class QuestionService {
  public featherService: Service<Question>;

  /**
   *
   */
  constructor(service: Service<Question>) {
    this.featherService = service;

    this.featherService.hooks({
      after: {
        all: afterAllHook()
      }
    });
  }
}
