import { Service } from '@feathersjs/feathers';
import { afterAllHook } from '../hooks/questionType.hooks';
import { QuestionType } from '../classes/questionType.class';
import { BaseService } from './baseService';

export class QuestionTypeService extends BaseService<QuestionType> {
  /**
   *
   */
  constructor(service: Service<QuestionType>) {
    super(service);

    this.featherService.hooks({
      after: {
        all: afterAllHook()
      }
    });
  }
}
