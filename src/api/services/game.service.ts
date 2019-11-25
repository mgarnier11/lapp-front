import { Service } from '@feathersjs/feathers';
import { afterAllHook } from '../hooks/game.hooks';
import { Game } from '../classes/game.class';

export class GameService {
  public featherService: Service<Game>;

  /**
   *
   */
  constructor(service: Service<Game>) {
    this.featherService = service;

    this.featherService.hooks({
      after: {
        all: afterAllHook()
      }
    });
  }
}
