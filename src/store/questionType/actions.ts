// store/session/actions.ts
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { QuestionTypeActionTypes } from './types';
import apiHandler from '../../api/apiHandler';
import { addError } from '../error/actions';
import { QuestionType } from '../../api/classes/questionType.class';

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

const questionTypeActionStartedCreator = (): ActionStarted => {
  return {
    type: QuestionTypeActionTypes.ACTION_STARTED
  };
};

const questionTypeActionFailureCreator = (): ActionFailure => {
  return {
    type: QuestionTypeActionTypes.ACTION_FAILURE
  };
};

// Async Actions
export const questionTypeCreate = (
  questionType: Partial<QuestionType>
): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
  ): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      dispatch(questionTypeActionStartedCreator());
      apiHandler.questionTypeService.featherService
        .create(questionType)
        .then(questionType => {
          dispatch({
            type: QuestionTypeActionTypes.CREATE,
            questionType: questionType
          });
          resolve(true);
        })
        .catch(error => {
          dispatch(questionTypeActionFailureCreator());
          dispatch(addError(error));
          resolve(false);
        });
    });
  };
};

export const questionTypeUpdate = (
  questionType: QuestionType
): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
  ): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      dispatch(questionTypeActionStartedCreator());
      apiHandler.questionTypeService.featherService
        .update(questionType.id, questionType)
        .then(questionType => {
          console.log(questionType);

          dispatch({
            type: QuestionTypeActionTypes.UPDATE,
            questionType: questionType
          });
          resolve(true);
        })
        .catch(error => {
          dispatch(questionTypeActionFailureCreator());
          dispatch(addError(error));
          resolve(false);
        });
    });
  };
};

export const questionTypeRemove = (
  questionTypeId: string
): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
  ): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      dispatch(questionTypeActionStartedCreator());
      apiHandler.questionTypeService.featherService
        .remove(questionTypeId)
        .then(questionType => {
          dispatch({
            type: QuestionTypeActionTypes.REMOVE,
            questionType: questionType
          });
          resolve(true);
        })
        .catch(error => {
          dispatch(questionTypeActionFailureCreator());
          dispatch(addError(error));
          resolve(false);
        });
    });
  };
};

export const questionTypeGetAll = (): ThunkAction<
  Promise<boolean>,
  {},
  {},
  AnyAction
> => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
  ): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      dispatch(questionTypeActionStartedCreator());
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
          dispatch(questionTypeActionFailureCreator());
          dispatch(addError(error));
          resolve(false);
        });
    });
  };
};
