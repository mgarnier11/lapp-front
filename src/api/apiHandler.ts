import * as io from 'socket.io-client';

import Feathers from '@feathersjs/feathers';
import FeathersSocketIOClient from '@feathersjs/socketio-client';
import FeathersAuthClient2 from '@feathersjs/authentication-client';
import { User } from './classes/user.class';
import { QuestionType } from './classes/questionType.class';
import { Question } from './classes/question.class';
import { Role } from './classes/role.class';
import { Game } from './classes/game.class';
import { roleServiceExtension } from './extensions/role.extension';
import { gameServiceExtension } from './extensions/game.extension';
import { questionServiceExtension } from './extensions/question.extension';
import { questionTypeServiceExtension } from './extensions/questionType.extension';
import { userServiceExtension } from './extensions/user.extension';

class ApiHandler {
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
  }

  public get userService(): Feathers.Service<User> {
    return userServiceExtension(this._feathers.service('users'));
  }

  public get roleService(): Feathers.Service<Role> {
    return roleServiceExtension(this._feathers.service('roles'));
  }

  public get questionTypeService(): Feathers.Service<QuestionType> {
    return questionTypeServiceExtension(
      this._feathers.service('question-types')
    );
  }

  public get questionService(): Feathers.Service<Question> {
    return questionServiceExtension(this._feathers.service('questions'));
  }

  public get gameService(): Feathers.Service<Game> {
    return gameServiceExtension(this._feathers.service('games'));
  }

  public async isAuthenticated() {
    /*
    if (
      this._feathers.passport.payloadIsValid(
        await this.feathers.passport.getJWT()
      )
    ) {
      if (await this.feathers.get('user')) {
        return true;
      } else if ((await this.login()) === null) {
        return true;
      }
    }
    return false;
    */
  }

  async logout() {
    await this._feathers.logout();
  }

  async login(credentials: any) {
    //console.log(credentials);
    let response = undefined;

    if (credentials) {
      let options = {
        ...{ strategy: 'local' },
        ...credentials
      };
      response = await this._feathers.authenticate(options);
    } else {
      response = await this._feathers.reAuthenticate();
    }

    console.log(response);

    return null;
  }

  async register(credentials: any) {
    try {
      console.log(await this.userService.create(credentials));

      return null;
    } catch (error) {
      console.log(error);

      return error;
    }
  }
}

export default new ApiHandler();
