import { Service } from '@feathersjs/feathers';
import { afterAllHook } from '../hooks/role.hooks';
import { Role } from '../classes/role.class';
import { BaseService } from './baseService';

export class RoleService extends BaseService<Role> {
  /**
   *
   */
  constructor(service: Service<Role>) {
    super(service);

    this.featherService.hooks({
      after: {
        all: afterAllHook()
      }
    });
  }

  public async getUserRole(): Promise<Role> {
    let role = (await this.featherService.find({
      query: {
        name: 'user'
      }
    })) as Role[];

    return role[0];
  }
}
