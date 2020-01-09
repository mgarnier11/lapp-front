import { Service } from '@feathersjs/feathers';
import { afterAllHook } from '../hooks/game.hooks';
import { Game } from '../classes/game.class';
import { BaseService } from './baseService';

export class GameService extends BaseService<Game> {
  /**
   *
   */
  constructor(service: Service<Game>) {
    super(service);

    this.featherService.hooks({
      after: {
        all: afterAllHook()
      }
    });
  }

  public async findGameByDisplayId(displayId: string) {
    let games = (await this.featherService.find({
      query: {
        displayId: displayId
      }
    })) as Game[];

    return games[0];
  }

  public async findCreatedGamesPerUser(userId: string) {
    let createdGames = await this.featherService.find({
      query: {
        creatorId: { $in: [userId] }
      }
    });

    return createdGames;
  }

  public async findGamesPerUser(userId: string) {
    let games = await this.featherService.find({
      query: {
        userIds: { $elemMatch: { $in: [userId] } }
      }
    });

    return games;
  }
}
