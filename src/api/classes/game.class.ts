import { QuestionType, QuestionTypeBackModel } from './questionType.class';
import { User, UserBackModel } from './user.class';
import { GameType, GameTypeBackModel } from './gameType.class';

export interface GameBackModel {
  _id: string;
  _displayId: string;
  _name: string;
  _users: UserBackModel[];
  _nbTurns: number;
  _actualTurn: number;
  _questionTypes: QuestionTypeBackModel[];
  _maxDifficulty: number;
  _maxHotLevel: number;
  _creator: UserBackModel;
  _type: GameTypeBackModel;
}

export enum GameStatus {
  created = 'Created',
  started = 'Started',
  finished = 'Finished'
}

export class Game {
  public id: string = '';

  public displayId: string = '';

  public name: string = '';

  public users: User[] = [];

  public nbTurns: number = 0;

  public actualTurn: number = 0;

  public questionTypes: QuestionType[] = [];

  public maxDifficulty: number = 0;

  public maxHotLevel: number = 0;

  public creator: User = new User();

  public type: GameType = new GameType();

  public status: GameStatus = GameStatus.created;

  public static New(datas: Partial<Game>): Game {
    return Object.assign(new Game(), datas);
  }

  public static fromBack(datas: any) {
    let newObj = new Game();

    newObj.id = datas._id;
    newObj.displayId = datas._displayId;
    newObj.name = datas._name;
    for (const userModel of datas._users) {
      newObj.users.push(User.fromBack(userModel));
    }
    newObj.nbTurns = datas._nbTurns;
    newObj.actualTurn = datas._actualTurn;
    for (const questionTypeModel of datas._questionTypes) {
      newObj.questionTypes.push(QuestionType.fromBack(questionTypeModel));
    }
    newObj.maxDifficulty = datas._maxDifficulty;
    newObj.maxHotLevel = datas._maxHotLevel;
    newObj.creator = User.fromBack(datas._creator);
    newObj.type = GameType.fromBack(datas._type);
    newObj.status = datas._status;

    return newObj;
  }
}
