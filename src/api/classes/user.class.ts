import { Role, RoleBackModel } from './role.class';

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
}

export class User {
  public id: string = '';

  public name: string = '';

  public email: string = '';

  public password: string = '';

  public role: Role = new Role();

  public gender: number = 0;

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

    return newObj;
  }
}
