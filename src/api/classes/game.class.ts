import { QuestionType, QuestionTypeBackModel } from './questionType.class';
import { User, UserBackModel } from './user.class';
import { GameType, GameTypeBackModel } from './gameType.class';
import { DummyUser } from './dummyUser.class';

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

export enum GameStatusColors {
  Created = 'default',
  Started = 'primary',
  Finished = 'secondary'
}

export class Game {
  public id: string = '';

  public displayId: string = '';

  public name: string = '';

  public users: User[] = [];

  public dummyUsers: DummyUser[] = [];

  public nbTurns: number = 0;

  public actualTurn: number = 0;

  public questionTypes: QuestionType[] = [];

  public maxDifficulty: number = 0;

  public maxHotLevel: number = 0;

  public creator: User = new User();

  public type: GameType = new GameType();

  public status: GameStatus = GameStatus.created;

  public get allUsers() {
    return [...this.users, ...this.dummyUsers];
  }

  public canStart(): boolean {
    if (this.allUsers.length <= 1) return false;
    return true;
  }

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
    for (const dummyUserModel of datas._dummyUsers) {
      newObj.dummyUsers.push(DummyUser.fromBack(dummyUserModel));
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

  public static CompareArrays(arr1: Game[], arr2: Game[]): boolean {
    return (
      arr1.length === arr2.length &&
      arr1.every((e, i) => Game.CompareObjects(e, arr2[i]))
    );
  }

  public static CompareObjects(obj1: Game, obj2: Game): boolean {
    return (
      obj1 !== undefined &&
      obj2 !== undefined &&
      obj1.id === obj2.id &&
      obj1.displayId === obj2.displayId &&
      obj1.name === obj2.name &&
      User.CompareArrays(obj1.users, obj2.users) &&
      obj1.nbTurns === obj2.nbTurns &&
      obj1.actualTurn === obj2.actualTurn &&
      QuestionType.CompareArrays(obj1.questionTypes, obj2.questionTypes) &&
      obj1.maxDifficulty === obj2.maxDifficulty &&
      obj1.maxHotLevel === obj2.maxHotLevel &&
      User.CompareObjects(obj1.creator, obj2.creator) &&
      GameType.CompareObjects(obj1.type, obj2.type) &&
      obj1.status === obj2.status
    );
  }
}
