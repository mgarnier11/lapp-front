import seedRandom from 'seedrandom';
import uuid from 'uuid';
import { User, LoginCredentials } from './api/classes/user.class';

const idVice = 'id-vice';
const idVicePwd = 'id-vice-pwd';

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

  public static setNewDeviceId(deviceId?: string) {
    if (!deviceId) deviceId = uuid.v1();

    localStorage.setItem(idVice, deviceId);

    return deviceId;
  }

  public static saveIDVice(idVice: User) {
    localStorage.setItem(idVicePwd, idVice.password);
    Helper.setNewDeviceId(idVice.email);
  }

  public static getIDViceCredentials(): LoginCredentials {
    let pwd = localStorage.getItem(idVicePwd);
    let mail = Helper.getDeviceId();

    if (!pwd) throw new Error('Password not initlaized');

    return { email: mail, password: pwd };
  }

  public static explodeArray<T>(arr: T[], nbFragments: number): T[][] {
    let resArrays = Array.from({ length: nbFragments }, () => new Array<T>());

    for (let i = 0; i < arr.length; i++)
      resArrays[i % nbFragments].push(arr[i]);

    return resArrays;
  }

  public static getPlayer(
    actualTurn: number,
    nbTurns: number,
    nbPlayers: number,
    seed: string
  ): number {
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
