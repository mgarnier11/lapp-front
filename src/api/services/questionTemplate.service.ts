import { Service } from '@feathersjs/feathers';
import { afterAllHook } from '../hooks/questionTemplate.hooks';
import { QuestionTemplate } from '../classes/questionTemplate.class';
import { BaseService } from './baseService';

export class QuestionTemplateService extends BaseService<QuestionTemplate> {
  /**
   *
   */
  constructor(service: Service<QuestionTemplate>) {
    super(service);

    this.featherService.hooks({
      after: {
        all: afterAllHook()
      }
    });
  }
}
