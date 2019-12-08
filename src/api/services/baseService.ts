import { Service } from '@feathersjs/feathers';
import { EventEmitter } from 'events';

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
