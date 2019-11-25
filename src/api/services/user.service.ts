import { Service } from '@feathersjs/feathers';
import { afterAllHook } from '../hooks/user.hooks';
import { User } from '../classes/user.class';

export class UserService {
  public featherService: Service<User>;

  /**
   *
   */
  constructor(service: Service<User>) {
    this.featherService = service;

    this.featherService.hooks({
      after: {
        all: afterAllHook()
      }
    });
  }
}
