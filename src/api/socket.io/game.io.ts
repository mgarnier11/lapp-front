export class GameIo {
  private _io: SocketIOClient.Socket;

  /**
   *
   */
  constructor(io: SocketIOClient.Socket) {
    this._io = io;
  }

  public joinGame(gameId: string) {
    this._io.emit('joinGame', { gameId }, (resParams: any) => {
      console.log(resParams);
    });
  }

  public leaveGame(gameId: string) {
    this._io.emit('leaveGame', { gameId }, (resParams: any) => {
      console.log(resParams);
    });
  }
}
