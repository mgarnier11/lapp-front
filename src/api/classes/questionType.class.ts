export interface QuestionTypeBackModel {
  _id: string;
  _name: string;
}

export class QuestionType {
  public id: string = '';

  public name: string = '';

  public static New(datas: Partial<QuestionType>): QuestionType {
    return Object.assign(new QuestionType(), datas);
  }

  public static fromBack(datas: QuestionTypeBackModel) {
    let newObj = new QuestionType();

    newObj.id = datas._id;
    newObj.name = datas._name;

    return newObj;
  }
}
