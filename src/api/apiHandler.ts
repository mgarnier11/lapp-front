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
import { AuthenticationResult } from '@feathersjs/authentication/lib';

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
      this._feathers.service('questionTypes')
    );
  }

  public roleService: RoleService;
  public userservice: UserService;
  public questionService: QuestionService;
  public gameService: GameService;
  public questionTypeService: QuestionTypeService;

  //authentication
  public async isAuthenticated() {
    try {
      let response = await this._feathers.reAuthenticate();
      if (response.user) return true;
      else return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  get authenticatedUser() {
    return (async () => {
      try {
        let response = await this._feathers.reAuthenticate();
        return User.fromBack(response.user);
      } catch (error) {
        return undefined;
      }
    })();
  }

  async logout() {
    await this._feathers.logout();
  }

  async login(credentials?: LoginCredentials) {
    //console.log(credentials);
    let options = {
      ...{ strategy: 'local' },
      ...credentials
    };
    let response = await this._feathers.authenticate(options);

    if (response.user) response.user = User.fromBack(response.user);

    return response;
  }

  async register(credentials: Partial<User>) {
    try {
      console.log(await this.userservice.featherService.create(credentials));

      return null;
    } catch (error) {
      console.log(error);

      return error;
    }
  }
}

export default new ApiHandler();