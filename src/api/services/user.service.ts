import { Service } from '@feathersjs/feathers';
import { afterAllHook } from '../hooks/user.hooks';
import { User } from '../classes/user.class';
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

  public async findUsersByPartialName(partialName: string) {
    if (partialName.length < 4) throw new Error('Name is not long enough');

    let users = (await this.featherService.find({
      query: {
        name: {
          $search: partialName
        }
      }
    })) as User[];

    return users;
  }
}
