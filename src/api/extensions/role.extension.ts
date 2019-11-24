import { Service } from '@feathersjs/feathers';
import { afterAllHook } from '../hooks/role.hooks';
import { Role } from '../classes/role.class';

export function roleServiceExtension(service: Service<Role>): Service<Role> {
  service.hooks({
    after: {
      all: afterAllHook()
    }
  });

  return service;
}
