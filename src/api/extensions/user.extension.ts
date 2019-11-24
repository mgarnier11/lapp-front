import { Service } from '@feathersjs/feathers';
import { afterAllHook } from '../hooks/user.hooks';
import { User } from '../classes/user.class';

export function userServiceExtension(service: Service<User>): Service<User> {
  service.hooks({
    after: {
      all: afterAllHook()
    }
  });

  return service;
}
