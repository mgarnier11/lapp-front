import { Service } from '@feathersjs/feathers';
import { EventEmitter } from 'events';

export enum ServiceNames {
  Question = 'Question',
  User = 'User',
  Role = 'Role',
  QuestionType = 'QuestionType',
  Game = 'Game'
}

export interface ServiceEvent {
  type: string;
  name: ServiceNames;
  callback?: Function;
}

export class BaseService<T> {
  public featherService: Service<T>;
  public ownEvents: EventEmitter;

  /**
   *
   */
  constructor(service: Service<T>) {
    this.featherService = service;

    this.ownEvents = new EventEmitter();
  }
}
