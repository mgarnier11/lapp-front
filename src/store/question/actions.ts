// store/session/actions.ts
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { QuestionActionTypes } from './types';
import apiHandler from '../../api/apiHandler';
import { addError } from '../error/actions';
import { Question } from '../../api/classes/question.class';

// Action Definition
export interface ActionStarted {
  type: QuestionActionTypes.ACTION_STARTED;
}
export interface ActionFailure {
  type: QuestionActionTypes.ACTION_FAILURE;
}
export interface Create {
  type: QuestionActionTypes.CREATE;
  question: Question;
}
export interface Update {
  type: QuestionActionTypes.UPDATE;
  question: Question;
}
export interface Remove {
  type: QuestionActionTypes.REMOVE;
  question: Question;
}
export interface GetAll {
  type: QuestionActionTypes.GETALL;
  questions: Question[];
}
// Union Action Types
export type Action =
  | ActionStarted
  | ActionFailure
  | Create
  | Update
  | Remove
  | GetAll;

const questionActionStartedCreator = (): ActionStarted => {
  return {
    type: QuestionActionTypes.ACTION_STARTED
  };
};

const questionActionFailureCreator = (): ActionFailure => {
  return {
    type: QuestionActionTypes.ACTION_FAILURE
  };
};

// Async Actions
export const questionCreate = (
  question: Partial<Question>
): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
  ): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      dispatch(questionActionStartedCreator());
      apiHandler.questionService.featherService
        .create(question)
        .then(question => {
          dispatch({
            type: QuestionActionTypes.CREATE,
            question: question
          });
          apiHandler.questionService.ownEvents.emit('created', question);

          resolve(true);
        })
        .catch(error => {
          dispatch(questionActionFailureCreator());
          dispatch(addError(error));
          resolve(false);
        });
    });
  };
};

export const questionUpdate = (
  question: Question
): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
  ): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      dispatch(questionActionStartedCreator());
      apiHandler.questionService.featherService
        .patch(question.id, question)
        .then(question => {
          dispatch({
            type: QuestionActionTypes.UPDATE,
            question: question
          });
          apiHandler.questionService.ownEvents.emit('updated', question);
          resolve(true);
        })
        .catch(error => {
          dispatch(questionActionFailureCreator());
          dispatch(addError(error));
          resolve(false);
        });
    });
  };
};

export const questionRemove = (
  questionId: string
): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
  ): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      dispatch(questionActionStartedCreator());
      apiHandler.questionService.featherService
        .remove(questionId)
        .then(question => {
          dispatch({
            type: QuestionActionTypes.REMOVE,
            question: question
          });
          apiHandler.questionService.ownEvents.emit('removed', question);

          resolve(true);
        })
        .catch(error => {
          dispatch(questionActionFailureCreator());
          dispatch(addError(error));
          resolve(false);
        });
    });
  };
};

export const questionGetAll = (): ThunkAction<
  Promise<boolean>,
  {},
  {},
  AnyAction
> => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
  ): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      dispatch(questionActionStartedCreator());
      apiHandler.questionService.featherService
        .find()
        .then(questions => {
          dispatch({
            type: QuestionActionTypes.GETALL,
            questions: questions
          });
          resolve(true);
        })
        .catch(error => {
          dispatch(questionActionFailureCreator());
          dispatch(addError(error));
          resolve(false);
        });
    });
  };
};
