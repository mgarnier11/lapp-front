import seedRandom from 'seedrandom';
import uuid from 'uuid';
import systeminformation from 'systeminformation';

const idVice = 'id-vice';

export class Helper {
  public static clone<T>(instance: T, newProps?: Partial<T>): T {
    return Object.assign(Object.create(instance as any), instance, newProps);
  }

  public static getDeviceId() {
    return Helper.setDeviceId();
  }

  public static setDeviceId() {
    //get a the actual device id, set a new if undefined
    let deviceId = localStorage.getItem(idVice);

    if (!deviceId) deviceId = Helper.setNewDeviceId();

    return deviceId;
  }

  public static setNewDeviceId() {
    let deviceId = uuid.v1();

    localStorage.setItem(idVice, deviceId);

    return deviceId;
  }

  public static getPlayer(
    actualTurn: number,
    nbTurns: number,
    nbPlayers: number,
    seed: string
  ) {
    let rng = seedRandom(seed);

    let playersNbTurns: number[] = [...new Array(nbPlayers)].fill(
      Math.ceil(nbTurns / nbPlayers)
    );

    function choosePlayer(): number {
      let choosedPlayer = Math.floor(rng() * nbPlayers);

      if (playersNbTurns[choosedPlayer] === 0) {
        return choosePlayer();
      }

      return choosedPlayer;
    }

    let choosedPlayer = 0;

    for (let i = 0; i < actualTurn; i++) {
      choosedPlayer = choosePlayer();

      playersNbTurns[choosedPlayer] = playersNbTurns[choosedPlayer] - 1;
    }

    return choosedPlayer;
  }

  public static verify(nbTurns: number, nbPlayers: number, seed: string) {
    return new Promise((res, rej) => {
      let results: number[] = [...new Array(nbPlayers)].fill(0);
      for (let i = 0; i < nbTurns; i++) {
        let result = Helper.getPlayer(i, nbTurns, nbPlayers, seed);

        results[result] = results[result] + 1;
      }

      res(results);
    });
  }
}
