export interface ScoreBackModel {
  _score: number;
  _userId: string;
}

export class Score {
  public score: number = 0;

  public userId: string = '';

  public temp(): string {
    return 'ok';
  }

  public static New(datas: Partial<Score>): Score {
    return Object.assign(new Score(), datas);
  }

  public static fromBack(datas: ScoreBackModel) {
    let newObj = new Score();

    newObj.score = datas._score;
    newObj.userId = datas._userId;

    return newObj;
  }

  public static CompareArrays(arr1: Score[], arr2: Score[]): boolean {
    return (
      arr1.length === arr2.length &&
      arr1.every((e, i) => Score.CompareObjects(e, arr2[i]))
    );
  }
  public static CompareObjects(obj1: Score, obj2: Score): boolean {
    return (
      obj1 !== undefined &&
      obj2 !== undefined &&
      obj1.score === obj2.score &&
      obj1.userId === obj2.userId
    );
  }
}
