import { Service } from '@feathersjs/feathers';
import { afterAllHook } from '../hooks/gameType.hooks';
import { GameType } from '../classes/gameType.class';
import { EventEmitter } from 'events';
import { BaseService } from './baseService';

export class GameTypeService extends BaseService<GameType> {
  /**
   *
   */
  constructor(service: Service<GameType>) {
    super(service);

    this.featherService.hooks({
      after: {
        all: afterAllHook()
      }
    });
  }
}
