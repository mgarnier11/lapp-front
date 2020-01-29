// store/session/actions.ts

import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { store } from '../index';
import { QuestionsActionTypes } from './types';
import apiHandler from '../../api/apiHandler';
import { addError } from '../errors/actions';
import { Question, QuestionBackModel } from '../../api/classes/question.class';
import { ServiceEvents } from '../../api/services/baseService';

// Action Definition
export interface ActionStarted {
  type: QuestionsActionTypes.ACTION_STARTED;
}
export interface ActionFailure {
  type: QuestionsActionTypes.ACTION_FAILURE;
}
export interface Create {
  type: QuestionsActionTypes.CREATE;
  question: Question;
}
export interface Update {
  type: QuestionsActionTypes.UPDATE;
  question: Question;
}
export interface Remove {
  type: QuestionsActionTypes.REMOVE;
  question: Question;
}
export interface GetAll {
  type: QuestionsActionTypes.GETALL;
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

export class QuestionsActions {
  private binded: boolean = false;

  public bindBaseEvents() {
    if (!this.binded) {
      apiHandler.questionService.featherService.on(
        ServiceEvents.created,
        this.questionCreated
      );
      apiHandler.questionService.featherService.on(
        ServiceEvents.patched,
        this.questionUpdated
      );
      apiHandler.questionService.featherService.on(
        ServiceEvents.removed,
        this.questionRemoved
      );

      this.binded = true;
    } else {
      console.log('cant rebind events');
    }
  }

  public unbindEvents() {
    apiHandler.questionService.featherService.off(
      ServiceEvents.created,
      this.questionCreated
    );
    apiHandler.questionService.featherService.off(
      ServiceEvents.patched,
      this.questionUpdated
    );
    apiHandler.questionService.featherService.off(
      ServiceEvents.removed,
      this.questionRemoved
    );

    this.binded = false;
  }

  private questionCreated(questionModel: QuestionBackModel) {
    store.dispatch({
      type: QuestionsActionTypes.CREATE,
      question: Question.fromBack(questionModel)
    });
  }

  private questionUpdated(questionModel: QuestionBackModel) {
    store.dispatch({
      type: QuestionsActionTypes.UPDATE,
      question: Question.fromBack(questionModel)
    });
  }

  private questionRemoved(questionModel: QuestionBackModel) {
    store.dispatch({
      type: QuestionsActionTypes.REMOVE,
      question: Question.fromBack(questionModel)
    });
  }

  private static questionsActionStartedCreator = (): ActionStarted => {
    return {
      type: QuestionsActionTypes.ACTION_STARTED
    };
  };

  private static questionsActionFailureCreator = (): ActionFailure => {
    return {
      type: QuestionsActionTypes.ACTION_FAILURE
    };
  };

  public static questionCreate = (
    question: Partial<Question>
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(QuestionsActions.questionsActionStartedCreator());
        apiHandler.questionService.featherService
          .create(question)
          .then(question => {
            /*
            dispatch({
              type: QuestionActionTypes.CREATE,
              question: question
            });
            */
            apiHandler.questionService.ownEvents.emit(
              ServiceEvents.created,
              question
            );
            resolve(true);
          })
          .catch(error => {
            dispatch(QuestionsActions.questionsActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };

  public static questionUpdate = (
    question: Question
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(QuestionsActions.questionsActionStartedCreator());
        apiHandler.questionService.featherService
          .patch(question.id, question)
          .then(question => {
            /*
          dispatch({
            type: QuestionActionTypes.UPDATE,
            question: question
          });
          */
            apiHandler.questionService.ownEvents.emit(
              ServiceEvents.updated,
              question
            );

            resolve(true);
          })
          .catch(error => {
            dispatch(QuestionsActions.questionsActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };

  public static questionRemove = (
    questionId: string
  ): ThunkAction<Promise<boolean>, {}, {}, AnyAction> => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(QuestionsActions.questionsActionStartedCreator());
        apiHandler.questionService.featherService
          .remove(questionId)
          .then(question => {
            /*
            dispatch({
              type: QuestionActionTypes.REMOVE,
              question: question
            });
            */
            apiHandler.questionService.ownEvents.emit(
              ServiceEvents.removed,
              question
            );

            resolve(true);
          })
          .catch(error => {
            dispatch(QuestionsActions.questionsActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };

  public static questionGetAll = (): ThunkAction<
    Promise<boolean>,
    {},
    {},
    AnyAction
  > => {
    return async (
      dispatch: ThunkDispatch<{}, {}, AnyAction>
    ): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        dispatch(QuestionsActions.questionsActionStartedCreator());
        apiHandler.questionService.featherService
          .find()
          .then(questions => {
            dispatch({
              type: QuestionsActionTypes.GETALL,
              questions: questions
            });
            resolve(true);
          })
          .catch(error => {
            console.log(error);

            dispatch(QuestionsActions.questionsActionFailureCreator());
            dispatch(addError(error));
            resolve(false);
          });
      });
    };
  };
}

export const questionActionsInstance = new QuestionsActions();
