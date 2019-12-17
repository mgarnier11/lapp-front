import { Action } from './actions';
import {
  QuestionsState,
  defaultQuestionsState,
  QuestionsActionTypes
} from './types';
// States' definition

export const questions = (
  questionState: QuestionsState = defaultQuestionsState,
  action: Action
): QuestionsState => {
  switch (action.type) {
    case QuestionsActionTypes.ACTION_STARTED: {
      return {
        ...questionState,
        loading: true
      };
    }
    case QuestionsActionTypes.ACTION_FAILURE: {
      return {
        ...questionState,
        loading: false
      };
    }

    case QuestionsActionTypes.CREATE: {
      if (questionState.questions) {
        return {
          ...questionState,
          questions: questionState.questions.concat(action.question),
          loading: false
        };
      } else {
        return {
          ...questionState,
          loading: false
        };
      }
    }

    case QuestionsActionTypes.UPDATE: {
      if (questionState.questions) {
        return {
          ...questionState,
          questions: questionState.questions.map(question =>
            question.id === action.question.id ? action.question : question
          ),
          loading: false
        };
      } else {
        return {
          ...questionState,
          loading: false
        };
      }
    }

    case QuestionsActionTypes.REMOVE: {
      if (questionState.questions) {
        return {
          ...questionState,
          questions: questionState.questions.filter(
            question => question.id !== action.question.id
          ),
          loading: false
        };
      } else {
        return {
          ...questionState,
          loading: false
        };
      }
    }

    case QuestionsActionTypes.GETALL: {
      return {
        ...questionState,
        questions: action.questions,
        loading: false
      };
    }
    default:
      return questionState;
  }
};

export default questions;
