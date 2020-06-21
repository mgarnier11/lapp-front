// store/session/actions.ts

import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { store } from '../index';
import { QuestionTemplatesActionTypes } from './types';
import apiHandler from '../../api/apiHandler';
import { addError } from '../errors/actions';
import {
  QuestionTemplate,
  QuestionTemplateBackModel
} from '../../api/classes/questionTemplate.class';
import { ServiceEvents } from '../../api/services/baseService';

// Action Definition
export interface ActionStarted {
  type: QuestionTemplatesActionTypes.ACTION_STARTED;
}
export interface ActionFailure {
  type: QuestionTemplatesActionTypes.ACTION_FAILURE;
}
export interface Create {
  type: QuestionTemplatesActionTypes.CREATE;
  questionTemplate: QuestionTemplate;
}
export interface Update {
  type: QuestionTemplatesActionTypes.UPDATE;
  questionTemplate: QuestionTemplate;
}
export interface Remove {
  type: QuestionTemplatesActionTypes.REMOVE;
  questionTemplate: QuestionTemplate;
}
export interface GetAll {
  type: QuestionTemplatesActionTypes.GETALL;
  questionTemplates: QuestionTemplate[];
}
// Union Action Types
export type Action =
  | ActionStarted
  | ActionFailure
  | Create
  | Update
  | Remove
  | GetAll;

export class QuestionTemplatesActions {
  private binded: boolean = false;

  public bindBaseEvents() {
    if (!this.binded) {
      apiHandler.questionTemplateService.featherService.on(
        ServiceEvents.created,
        this.questionTemplateCreated
      );
      apiHandler.questionTemplateService.featherService.on(
        ServiceEvents.patched,
        this.questionTemplateUpdated
      );
      apiHandler.questionTemplateService.featherService.on(
        ServiceEvents.removed,
        this.questionTemplateRemoved
      );

      this.binded = true;
    } else {
      console.log('cant rebind events');
    }
  }

  public unbindEvents() {
    apiHandler.questionTemplateService.featherService.off(
      ServiceEvents.created,
      this.questionTemplateCreated
    );
    apiHandler.questionTemplateService.featherService.off(
      ServiceEvents.patched,
      this.questionTemplateUpdated
    );
    apiHandler.questionTemplateService.featherService.off(
      ServiceEvents.removed,
      this.questionTemplateRemoved
    );

    this.binded = false;
  }

  private questionTemplateCreated(
    questionTemplateModel: QuestionTemplateBackModel
  ) {
    store.dispatch({
      type: QuestionTemplatesActionTypes.CREATE,
      questionTemplate: QuestionTemplate.fromBack(questionTemplateModel)
    });
  }

  private questionTemplateUpdated(
    questionTemplateModel: QuestionTemplateBackModel
  ) {
    store.dispatch({
      type: QuestionTemplatesActionTypes.UPDATE,
      questionTemplate: QuestionTemplate.fromBack(questionTemplateModel)
    });
  }

  private questionTemplateRemoved(
    questionTemplateModel: QuestionTemplateBackModel
  ) {
    store.dispatch({
      type: QuestionTemplatesActionTypes.REMOVE,
      questionTemplate: QuestionTemplate.fromBack(questionTemplateModel)
    });
  }

  private static questionTemplatesActionStartedCreator = (): ActionStarted => {
    return {
      type: QuestionTemplatesActionTypes.ACTION_STARTED
    };
  };

  private static questionTemplatesActionFailureCreator = (): ActionFailure => {
    return {
      type: QuestionTemplatesActionTypes.ACTION_FAILURE
    };
  };

  public static questionTemplateCreate = (
    questionTemplate: Partial<QuestionTemplate>
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(
          QuestionTemplatesActions.questionTemplatesActionStartedCreator()
        );
        apiHandler.questionTemplateService.featherService
          .create(questionTemplate)
          .then(questionTemplate => {
            /*
            dispatch({
              type: QuestionTemplateActionTypes.CREATE,
              questionTemplate: questionTemplate
            });
            */
            apiHandler.questionTemplateService.ownEvents.emit(
              ServiceEvents.created,
              questionTemplate
            );
            resolve(true);
          })
          .catch(error => {
            dispatch(
              QuestionTemplatesActions.questionTemplatesActionFailureCreator()
            );
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };

  public static questionTemplateUpdate = (
    questionTemplate: QuestionTemplate
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(
          QuestionTemplatesActions.questionTemplatesActionStartedCreator()
        );
        apiHandler.questionTemplateService.featherService
          .patch(questionTemplate.id, questionTemplate)
          .then(questionTemplate => {
            /*
          dispatch({
            type: QuestionTemplateActionTypes.UPDATE,
            questionTemplate: questionTemplate
          });
          */
            apiHandler.questionTemplateService.ownEvents.emit(
              'updated',
              questionTemplate
            );

            resolve(true);
          })
          .catch(error => {
            dispatch(
              QuestionTemplatesActions.questionTemplatesActionFailureCreator()
            );
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };

  public static questionTemplateRemove = (
    questionTemplateId: string
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(
          QuestionTemplatesActions.questionTemplatesActionStartedCreator()
        );
        apiHandler.questionTemplateService.featherService
          .remove(questionTemplateId)
          .then(questionTemplate => {
            /*
            dispatch({
              type: QuestionTemplateActionTypes.REMOVE,
              questionTemplate: questionTemplate
            });
            */
            apiHandler.questionTemplateService.ownEvents.emit(
              ServiceEvents.removed,
              questionTemplate
            );

            resolve(true);
          })
          .catch(error => {
            dispatch(
              QuestionTemplatesActions.questionTemplatesActionFailureCreator()
            );
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };

  public static questionTemplateGetAll = (): ThunkAction<
    Promise<boolean>,
    {},
    {},
    AnyAction
  > => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(
          QuestionTemplatesActions.questionTemplatesActionStartedCreator()
        );
        apiHandler.questionTemplateService.featherService
          .find()
          .then(questionTemplates => {
            dispatch({
              type: QuestionTemplatesActionTypes.GETALL,
              questionTemplates: questionTemplates
            });
            resolve(true);
          })
          .catch(error => {
            console.log(error);

            dispatch(
              QuestionTemplatesActions.questionTemplatesActionFailureCreator()
            );
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };
}

export const questionTemplateActionsInstance = new QuestionTemplatesActions();
