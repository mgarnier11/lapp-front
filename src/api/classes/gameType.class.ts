export interface GameTypeBackModel {
  _id: number;
  _name: string;
}

export class GameType {
  public id: number = 0;

  public name: string = '';

  public static New(datas: Partial<GameType>): GameType {
    return Object.assign(new GameType(), datas);
  }

  public static fromBack(datas: GameTypeBackModel) {
    let newObj = new GameType();

    newObj.id = datas._id;
    newObj.name = datas._name;

    return newObj;
  }

  public static CompareArrays(arr1: GameType[], arr2: GameType[]): boolean {
    return (
      arr1.length === arr2.length &&
      arr1.every((e, i) => GameType.CompareObjects(e, arr2[i]))
    );
  }

  public static CompareObjects(obj1: GameType, obj2: GameType): boolean {
    return obj1.id === obj2.id && obj1.name === obj2.name;
  }
}
