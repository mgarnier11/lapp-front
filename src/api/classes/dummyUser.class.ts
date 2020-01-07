import uuid from 'uuid';

export interface DummyUserBackModel {
  _id: string;
  _name: string;
  _gender: number;
}

export class DummyUser {
  public id: string = uuid.v1();

  public name: string = '';

  public gender: number = 0;

  public temp(): string {
    return 'ok';
  }

  public static New(datas: Partial<DummyUser>): DummyUser {
    return Object.assign(new DummyUser(), datas);
  }

  public static fromBack(datas: DummyUserBackModel) {
    let newObj = new DummyUser();

    newObj.id = datas._id;
    newObj.name = datas._name;
    newObj.gender = datas._gender;

    return newObj;
  }

  public static CompareArrays(arr1: DummyUser[], arr2: DummyUser[]): boolean {
    return (
      arr1.length === arr2.length &&
      arr1.every((e, i) => DummyUser.CompareObjects(e, arr2[i]))
    );
  }
  public static CompareObjects(obj1: DummyUser, obj2: DummyUser): boolean {
    return (
      obj1 !== undefined &&
      obj2 !== undefined &&
      obj1.name === obj2.name &&
      obj1.gender === obj2.gender &&
      obj1.id === obj2.id
    );
  }
}
