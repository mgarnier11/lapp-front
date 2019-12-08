import { QuestionType, QuestionTypeBackModel } from './questionType.class';
import { User, UserBackModel } from './user.class';

export interface QuestionBackModel {
  _id: string;
  _type: QuestionTypeBackModel;
  _text: string;
  _difficulty: number;
  _hotLevel: number;
  _creator: UserBackModel;
}

export class Question {
  public id: string = '';

  public type: QuestionType = new QuestionType();

  public text: string = '';

  public difficulty: number = 0;

  public hotLevel: number = 0;

  public creator: User = new User();

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
    newObj.creator = User.fromBack(datas._creator);

    return newObj;
  }

  public static CompareArrays(arr1: Question[], arr2: Question[]): boolean {
    return (
      arr1.length === arr2.length &&
      arr1.every(
        (e, i) =>
          e.id === arr2[i].id &&
          e.difficulty === arr2[i].difficulty &&
          e.hotLevel === arr2[i].hotLevel &&
          e.text === arr2[i].text &&
          e.type === arr2[i].type &&
          e.creator === arr2[i].creator
      )
    );
  }
}
