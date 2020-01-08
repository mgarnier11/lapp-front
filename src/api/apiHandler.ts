import * as io from 'socket.io-client';

import Feathers from '@feathersjs/feathers';
import FeathersSocketIOClient from '@feathersjs/socketio-client';
import FeathersAuthClient2 from '@feathersjs/authentication-client';

import { UserService } from './services/user.service';
import { QuestionService } from './services/question.service';
import { GameService } from './services/game.service';
import { QuestionTypeService } from './services/questionType.service';
import { RoleService } from './services/role.service';
import { User, LoginCredentials } from './classes/user.class';
import { ServiceNames } from './services/baseService';
import { GameTypeService } from './services/gameType.service';
import { Helper } from '../helper';

class ApiHandler {
  //api initialization
  private _feathers = Feathers(); // init feathers
  // @ts-ignore
  private _socket = io.connect(apiUrl, {
    transports: ['websocket'],
    forceNew: true
  }); //init socket io
  private _feathersAuthClient = require('@feathersjs/authentication-client')
    .default;

  constructor() {
    this._feathers
      .configure(FeathersSocketIOClient(this._socket)) // add socket.io plugin
      .configure(
        this._feathersAuthClient({
          // add authentication plugin
          storage: window.localStorage
        })
      );

    //services initiliaztion
    this.roleService = new RoleService(this._feathers.service('roles'));
    this.userservice = new UserService(this._feathers.service('users'));
    this.questionService = new QuestionService(
      this._feathers.service('questions')
    );
    this.gameService = new GameService(this._feathers.service('games'));
    this.questionTypeService = new QuestionTypeService(
      this._feathers.service('question-types')
    );
    this.gameTypeService = new GameTypeService(
      this._feathers.service('game-types')
    );
  }

  public roleService: RoleService;
  public userservice: UserService;
  public questionService: QuestionService;
  public gameService: GameService;
  public questionTypeService: QuestionTypeService;
  public gameTypeService: GameTypeService;

  public service(serviceName: ServiceNames) {
    switch (serviceName) {
      case ServiceNames.Question:
        return this.questionService;
      case ServiceNames.User:
        return this.userservice;
      case ServiceNames.Game:
        return this.gameService;
      case ServiceNames.Role:
        return this.roleService;
      case ServiceNames.QuestionType:
        return this.questionTypeService;
      case ServiceNames.GameType:
        return this.gameTypeService;
    }
  }

  //authentication
  public async reAuthenticate() {
    let response = await this._feathers.reAuthenticate();

    if (response.user) response.user = User.fromBack(response.user);

    return response;
  }

  public async logout() {
    await this._feathers.logout();
  }

  public async login(credentials?: LoginCredentials) {
    let options = {
      ...{ strategy: 'local' },
      ...credentials
    };
    let response = await this._feathers.authenticate(options);

    if (response.user) response.user = User.fromBack(response.user);

    return response;
  }

  public async register(userDatas: Partial<User>): Promise<User> {
    return await this.userservice.featherService.create(userDatas);
  }
}

export default new ApiHandler();
