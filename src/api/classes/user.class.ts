import { Role, RoleBackModel } from './role.class';
import { Game } from './game.class';
import { UserConfig, UserConfigBackModel } from './userConfig.class';
import isUUID from 'is-uuid';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserBackModel {
  _id: string;
  _name: string;
  _email: string;
  _password: string;
  _role: RoleBackModel;
  _gender: number;
  _config: UserConfigBackModel;
}

export const GenderTable = ['Man', 'Woman'];

export class User {
  public id: string = '';

  public name: string = '';

  public email: string = '';

  public password: string = '';

  public role: Role = new Role();

  public gender: number = 0;

  public config: UserConfig = new UserConfig();

  public createdGames: Game[] = [];

  public games: Game[] = [];

  public isIDVice(): boolean {
    return isUUID.v1(this.email);
  }

  public static New(datas: Partial<User>): User {
    return Object.assign(new User(), datas);
  }

  public static fromBack(datas: UserBackModel) {
    let newObj = new User();

    newObj.id = datas._id;
    newObj.name = datas._name;
    newObj.email = datas._email;
    newObj.role = Role.fromBack(datas._role);
    newObj.gender = datas._gender;
    newObj.password = datas._password;
    newObj.config = UserConfig.fromBack(datas._config);

    return newObj;
  }

  public static CompareArrays(arr1: User[], arr2: User[]): boolean {
    return (
      arr1.length === arr2.length &&
      arr1.every((e, i) => User.CompareObjects(e, arr2[i]))
    );
  }
  public static CompareObjects(obj1: User, obj2: User): boolean {
    return (
      obj1 !== undefined &&
      obj2 !== undefined &&
      obj1.name === obj2.name &&
      obj1.email === obj2.email &&
      obj1.gender === obj2.gender &&
      obj1.password === obj2.password &&
      obj1.id === obj2.id &&
      UserConfig.CompareObjects(obj1.config, obj2.config) &&
      Role.CompareObjects(obj1.role, obj2.role)
    );
  }

  public static passwordMinLength = 8;
  public static nameMinLength = 0;
  public static emailMinLength = 0;
}
