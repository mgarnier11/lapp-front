import { QuestionType, QuestionTypeBackModel } from './questionType.class';
import { User, UserBackModel } from './user.class';

export interface QuestionBackModel {
  _id: string;
  _type: QuestionTypeBackModel;
  _text: string;
  _difficulty: number;
  _hotLevel: number;
  _creator: UserBackModel;
  _creationDate: string;
  _updateDate: string;
}

export class Question {
  public id: string = '';

  public type: QuestionType = new QuestionType();

  public text: string = '';

  public difficulty: number = 0;

  public hotLevel: number = 0;

  public creator: User = new User();

  public creationDate: Date = new Date();

  public updateDate: Date = new Date();

  public static New(datas: Partial<Question>): Question {
    return Object.assign(new Question(), datas);
  }

  public static fromBack(datas: QuestionBackModel) {
    let newObj = new Question();
    console.log(datas);

    newObj.id = datas._id;
    newObj.type = QuestionType.fromBack(datas._type);
    newObj.text = datas._text;
    newObj.difficulty = datas._difficulty;
    newObj.hotLevel = datas._hotLevel;
    newObj.creator = User.fromBack(datas._creator);
    newObj.creationDate = new Date(datas._creationDate);
    newObj.updateDate = new Date(datas._updateDate);

    return newObj;
  }

  public static CompareArrays(arr1: Question[], arr2: Question[]): boolean {
    return (
      arr1.length === arr2.length &&
      arr1.every((e, i) => Question.CompareObjects(e, arr2[i]))
    );
  }

  public static CompareObjects(obj1: Question, obj2: Question): boolean {
    return (
      obj1 !== undefined &&
      obj2 !== undefined &&
      obj1.id === obj2.id &&
      obj1.difficulty === obj2.difficulty &&
      obj1.hotLevel === obj2.hotLevel &&
      obj1.text === obj2.text &&
      QuestionType.CompareObjects(obj1.type, obj2.type) &&
      User.CompareObjects(obj1.creator, obj2.creator)
    );
  }
}
