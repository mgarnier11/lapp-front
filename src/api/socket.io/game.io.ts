import { Application } from '@feathersjs/feathers';

export class GameIo {
  private _io: SocketIOClient.Socket;
  private _app: Application<any>;

  /**
   *
   */
  constructor(feathers: Application<any>) {
    this._io = feathers.io;
    this._app = feathers;
  }

  private async authedParams(params: any) {
    return { ...params, jwt: await this._app.authentication.getAccessToken() };
  }

  public async joinGame(gameId: string) {
    this._io.emit(
      'game:join',
      await this.authedParams({ gameId }),
      (resParams: any) => {
        console.log(resParams);
      }
    );
  }

  public async startGame(gameId: string) {
    this._io.emit(
      'game:start',
      await this.authedParams({ gameId }),
      (resParams: any) => {}
    );
  }

  public async answerQuestion(
    gameId: string,
    questionId: string,
    userId: string,
    answer: boolean
  ) {
    this._io.emit(
      'game:answerQuestion',
      await this.authedParams({ gameId, questionId, userId, answer }),
      (resParams: any) => {}
    );
  }

  public async leaveGame(gameId: string) {
    this._io.emit(
      'game:leave',
      await this.authedParams({ gameId }),
      (resParams: any) => {
        console.log(resParams);
      }
    );
  }

  public onceGameLoading(cb: (loading: boolean) => void) {
    this._io.once('game:loading', cb);
  }

  public onGameLoading(cb: (loading: boolean) => void) {
    this._io.on('game:loading', cb);
  }
}
