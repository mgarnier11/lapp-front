import { Service } from '@feathersjs/feathers';
import { afterAllHook } from '../hooks/question.hooks';
import { Question } from '../classes/question.class';
import { BaseService } from './baseService';

export class QuestionService extends BaseService<Question> {
  /**
   *
   */
  constructor(service: Service<Question>) {
    super(service);

    this.featherService.hooks({
      after: {
        all: afterAllHook()
      }
    });
  }
}
