import { Service } from '@feathersjs/feathers';
import { afterAllHook } from '../hooks/user.hooks';
import { User } from '../classes/user.class';
import { EventEmitter } from 'events';
import { BaseService } from './baseService';

export class UserService extends BaseService<User> {
  /**
   *
   */
  constructor(service: Service<User>) {
    super(service);

    this.featherService.hooks({
      after: {
        all: afterAllHook()
      }
    });
  }
}
