// store/session/actions.ts

import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { store } from '../index';
import { QuestionTypesActionTypes } from './types';
import apiHandler from '../../api/apiHandler';
import { addError } from '../errors/actions';
import {
  QuestionType,
  QuestionTypeBackModel,
} from '../../api/classes/questionType.class';
import { ServiceEvents } from '../../api/services/baseService';

// Action Definition
export interface ActionStarted {
  type: QuestionTypesActionTypes.ACTION_STARTED;
}
export interface ActionFailure {
  type: QuestionTypesActionTypes.ACTION_FAILURE;
}
export interface Create {
  type: QuestionTypesActionTypes.CREATE;
  questionType: QuestionType;
}
export interface Update {
  type: QuestionTypesActionTypes.UPDATE;
  questionType: QuestionType;
}
export interface Remove {
  type: QuestionTypesActionTypes.REMOVE;
  questionType: QuestionType;
}
export interface GetAll {
  type: QuestionTypesActionTypes.GETALL;
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

export class QuestionTypesActions {
  private binded: boolean = false;

  public bindBaseEvents() {
    if (!this.binded) {
      apiHandler.questionTypeService.featherService.on(
        ServiceEvents.created,
        this.questionTypeCreated
      );
      apiHandler.questionTypeService.featherService.on(
        ServiceEvents.patched,
        this.questionTypeUpdated
      );
      apiHandler.questionTypeService.featherService.on(
        ServiceEvents.removed,
        this.questionTypeRemoved
      );

      this.binded = true;
    } else {
      console.log('cant rebind events');
    }
  }

  public unbindEvents() {
    apiHandler.questionTypeService.featherService.off(
      ServiceEvents.created,
      this.questionTypeCreated
    );
    apiHandler.questionTypeService.featherService.off(
      ServiceEvents.patched,
      this.questionTypeUpdated
    );
    apiHandler.questionTypeService.featherService.off(
      ServiceEvents.removed,
      this.questionTypeRemoved
    );

    this.binded = false;
  }

  private questionTypeCreated(questionTypeModel: QuestionTypeBackModel) {
    store.dispatch({
      type: QuestionTypesActionTypes.CREATE,
      questionType: QuestionType.fromBack(questionTypeModel),
    });
  }

  private questionTypeUpdated(questionTypeModel: QuestionTypeBackModel) {
    store.dispatch({
      type: QuestionTypesActionTypes.UPDATE,
      questionType: QuestionType.fromBack(questionTypeModel),
    });
  }

  private questionTypeRemoved(questionTypeModel: QuestionTypeBackModel) {
    store.dispatch({
      type: QuestionTypesActionTypes.REMOVE,
      questionType: QuestionType.fromBack(questionTypeModel),
    });
  }

  private static questionTypesActionStartedCreator = (): ActionStarted => {
    return {
      type: QuestionTypesActionTypes.ACTION_STARTED,
    };
  };

  private static questionTypesActionFailureCreator = (): ActionFailure => {
    return {
      type: QuestionTypesActionTypes.ACTION_FAILURE,
    };
  };

  public static questionTypeCreate = (
    questionType: Partial<QuestionType>
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>((resolve) => {
        dispatch(QuestionTypesActions.questionTypesActionStartedCreator());
        apiHandler.questionTypeService.featherService
          .create(questionType)
          .then((questionType) => {
            /*
            dispatch({
              type: QuestionTypeActionTypes.CREATE,
              questionType: questionType
            });
            */
            apiHandler.questionTypeService.ownEvents.emit(
              ServiceEvents.created,
              questionType
            );
            resolve(true);
          })
          .catch((error) => {
            dispatch(QuestionTypesActions.questionTypesActionFailureCreator());
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
      return new Promise<boolean>((resolve) => {
        dispatch(QuestionTypesActions.questionTypesActionStartedCreator());
        apiHandler.questionTypeService.featherService
          .patch(questionType.id, questionType)
          .then((questionType) => {
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
          .catch((error) => {
            dispatch(QuestionTypesActions.questionTypesActionFailureCreator());
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
      return new Promise<boolean>((resolve) => {
        dispatch(QuestionTypesActions.questionTypesActionStartedCreator());
        apiHandler.questionTypeService.featherService
          .remove(questionTypeId)
          .then((questionType) => {
            /*
            dispatch({
              type: QuestionTypeActionTypes.REMOVE,
              questionType: questionType
            });
            */
            apiHandler.questionTypeService.ownEvents.emit(
              ServiceEvents.removed,
              questionType
            );

            resolve(true);
          })
          .catch((error) => {
            dispatch(QuestionTypesActions.questionTypesActionFailureCreator());
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
      return new Promise<boolean>((resolve) => {
        dispatch(QuestionTypesActions.questionTypesActionStartedCreator());
        apiHandler.questionTypeService.featherService
          .find()
          .then((questionTypes) => {
            dispatch({
              type: QuestionTypesActionTypes.GETALL,
              questionTypes: questionTypes,
            });
            resolve(true);
          })
          .catch((error) => {
            dispatch(QuestionTypesActions.questionTypesActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };
}

export const questionTypeActionsInstance = new QuestionTypesActions();
