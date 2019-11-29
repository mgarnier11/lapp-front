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

  public static CompareArrays(arr1: Role[], arr2: Role[]): boolean {
    return (
      arr1.length === arr2.length &&
      arr1.every(
        (e, i) =>
          e.id === arr2[i].id &&
          e.name === arr2[i].name &&
          e.icon === arr2[i].icon &&
          e.permissionLevel === arr2[i].permissionLevel
      )
    );
  }
}
