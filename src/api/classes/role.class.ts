export interface RoleBackModel {
  _id: string;
  _name: string;
  _icon: string;
  _permissionLevel: number;
}

export class Role {
  public id: string = '';
  public name: string = '';
  public icon: string = '';
  public permissionLevel: number = 0;

  public static New(datas: Partial<Role>): Role {
    return Object.assign(new Role(), datas);
  }

  public static fromBack(datas: RoleBackModel) {
    let newObj = new Role();

    newObj.id = datas._id;
    newObj.name = datas._name;
    newObj.icon = datas._icon;
    newObj.permissionLevel = datas._permissionLevel;

    return newObj;
  }
}
