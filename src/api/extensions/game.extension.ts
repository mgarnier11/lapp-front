import { Service } from '@feathersjs/feathers';
import { afterAllHook } from '../hooks/game.hooks';
import { Game } from '../classes/game.class';

export function gameServiceExtension(service: Service<Game>): Service<Game> {
  service.hooks({
    after: {
      all: afterAllHook()
    }
  });

  return service;
}
