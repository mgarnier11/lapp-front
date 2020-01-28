export interface QuestionTypeBackModel {
  _id: string;
  _name: string;
  _description: string;
}

export class QuestionType {
  public id: string = '';

  public name: string = '';

  public description: string = '';

  public temp(): string {
    return 'ok';
  }

  public static New(datas: Partial<QuestionType>): QuestionType {
    return Object.assign(new QuestionType(), datas);
  }

  public static fromBack(datas: QuestionTypeBackModel) {
    let newObj = new QuestionType();

    newObj.id = datas._id;
    newObj.name = datas._name;
    newObj.description = datas._description;

    return newObj;
  }

  public static CompareArrays(
    arr1: QuestionType[],
    arr2: QuestionType[]
  ): boolean {
    return (
      arr1.length === arr2.length &&
      arr1.every((e, i) => QuestionType.CompareObjects(e, arr2[i]))
    );
  }

  public static CompareObjects(
    obj1: QuestionType,
    obj2: QuestionType
  ): boolean {
    return (
      obj1 !== undefined &&
      obj2 !== undefined &&
      obj1.id === obj2.id &&
      obj1.name === obj2.name &&
      obj1.description === obj2.description
    );
  }
}
