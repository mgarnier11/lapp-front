// store/session/actions.ts

import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { store } from '../index';
import { QuestionTypeActionTypes } from './types';
import apiHandler from '../../api/apiHandler';
import { addError } from '../error/actions';
import {
  QuestionType,
  QuestionTypeBackModel
} from '../../api/classes/questionType.class';

// Action Definition
export interface ActionStarted {
  type: QuestionTypeActionTypes.ACTION_STARTED;
}
export interface ActionFailure {
  type: QuestionTypeActionTypes.ACTION_FAILURE;
}
export interface Create {
  type: QuestionTypeActionTypes.CREATE;
  questionType: QuestionType;
}
export interface Update {
  type: QuestionTypeActionTypes.UPDATE;
  questionType: QuestionType;
}
export interface Remove {
  type: QuestionTypeActionTypes.REMOVE;
  questionType: QuestionType;
}
export interface GetAll {
  type: QuestionTypeActionTypes.GETALL;
  questionTypes: QuestionType[];
}
// Union Action Types
export type Action =
  | ActionStarted
  | ActionFailure
  | Create
  | Update
  | Remove
  | GetAll;

export class QuestionTypeActions {
  private binded: boolean = false;
  /**
   *
   */
  constructor() {}

  public bindBaseEvents() {
    if (!this.binded) {
      apiHandler.questionTypeService.featherService.on(
        'created',
        this.questionTypeCreated
      );
      apiHandler.questionTypeService.featherService.on(
        'patched',
        this.questionTypeUpdated
      );
      apiHandler.questionTypeService.featherService.on(
        'removed',
        this.questionTypeRemoved
      );

      this.binded = true;
    } else {
      console.log('cant rebind events');
    }
  }

  public unbindEvents() {
    apiHandler.questionTypeService.featherService.off(
      'created',
      this.questionTypeCreated
    );
    apiHandler.questionTypeService.featherService.off(
      'patched',
      this.questionTypeUpdated
    );
    apiHandler.questionTypeService.featherService.off(
      'removed',
      this.questionTypeRemoved
    );

    this.binded = false;
  }

  private questionTypeCreated(questionTypeModel: QuestionTypeBackModel) {
    store.dispatch({
      type: QuestionTypeActionTypes.CREATE,
      questionType: QuestionType.fromBack(questionTypeModel)
    });
  }

  private questionTypeUpdated(questionTypeModel: QuestionTypeBackModel) {
    store.dispatch({
      type: QuestionTypeActionTypes.UPDATE,
      questionType: QuestionType.fromBack(questionTypeModel)
    });
  }

  private questionTypeRemoved(questionTypeModel: QuestionTypeBackModel) {
    store.dispatch({
      type: QuestionTypeActionTypes.REMOVE,
      questionType: QuestionType.fromBack(questionTypeModel)
    });
  }

  private static questionTypeActionStartedCreator = (): ActionStarted => {
    return {
      type: QuestionTypeActionTypes.ACTION_STARTED
    };
  };

  private static questionTypeActionFailureCreator = (): ActionFailure => {
    return {
      type: QuestionTypeActionTypes.ACTION_FAILURE
    };
  };

  public static questionTypeCreate = (
    questionType: Partial<QuestionType>
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(QuestionTypeActions.questionTypeActionStartedCreator());
        apiHandler.questionTypeService.featherService
          .create(questionType)
          .then(questionType => {
            /*
            dispatch({
              type: QuestionTypeActionTypes.CREATE,
              questionType: questionType
            });
            */
            apiHandler.questionTypeService.ownEvents.emit(
              'created',
              questionType
            );
            resolve(true);
          })
          .catch(error => {
            dispatch(QuestionTypeActions.questionTypeActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };

  public static questionTypeUpdate = (
    questionType: QuestionType
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(QuestionTypeActions.questionTypeActionStartedCreator());
        apiHandler.questionTypeService.featherService
          .patch(questionType.id, questionType)
          .then(questionType => {
            /*
          dispatch({
            type: QuestionTypeActionTypes.UPDATE,
            questionType: questionType
          });
          */
            apiHandler.questionTypeService.ownEvents.emit(
              'updated',
              questionType
            );

            resolve(true);
          })
          .catch(error => {
            dispatch(QuestionTypeActions.questionTypeActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };

  public static questionTypeRemove = (
    questionTypeId: string
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(QuestionTypeActions.questionTypeActionStartedCreator());
        apiHandler.questionTypeService.featherService
          .remove(questionTypeId)
          .then(questionType => {
            /*
            dispatch({
              type: QuestionTypeActionTypes.REMOVE,
              questionType: questionType
            });
            */
            apiHandler.questionTypeService.ownEvents.emit(
              'removed',
              questionType
            );

            resolve(true);
          })
          .catch(error => {
            dispatch(QuestionTypeActions.questionTypeActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };

  public static questionTypeGetAll = (): ThunkAction<
    Promise<boolean>,
    {},
    {},
    AnyAction
  > => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(QuestionTypeActions.questionTypeActionStartedCreator());
        apiHandler.questionTypeService.featherService
          .find()
          .then(questionTypes => {
            dispatch({
              type: QuestionTypeActionTypes.GETALL,
              questionTypes: questionTypes
            });
            resolve(true);
          })
          .catch(error => {
            dispatch(QuestionTypeActions.questionTypeActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };
}

export const questionTypeActionsInstance = new QuestionTypeActions();