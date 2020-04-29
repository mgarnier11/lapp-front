import { Service } from '@feathersjs/feathers';
import { afterAllHook, beforeUpsertHook } from '../hooks/question.hooks';
import { Question } from '../classes/question.class';
import { BaseService } from './baseService';

export class QuestionService extends BaseService<Question> {
  /**
   *
   */
  constructor(service: Service<Question>) {
    super(service);

    this.featherService.hooks({
      before: {
        create: beforeUpsertHook(),
        update: beforeUpsertHook(),
        patch: beforeUpsertHook(),
      },
      after: {
        all: afterAllHook(),
      },
    });
  }
}
