import { QuestionType, QuestionTypeBackModel } from './questionType.class';

export interface QuestionBackModel {
  _id: string;
  _type: QuestionTypeBackModel;
  _text: string;
  _difficulty: number;
  _hotLevel: number;
}

export class Question {
  public id: string = '';

  public type: QuestionType = new QuestionType();

  public text: string = '';

  public difficulty: number = 0;

  public hotLevel: number = 0;

  public static New(datas: Partial<Question>): Question {
    return Object.assign(new Question(), datas);
  }

  public static fromBack(datas: QuestionBackModel) {
    let newObj = new Question();

    newObj.id = datas._id;
    newObj.type = QuestionType.fromBack(datas._type);
    newObj.text = datas._text;
    newObj.difficulty = datas._difficulty;
    newObj.hotLevel = datas._hotLevel;

    return newObj;
  }
}
