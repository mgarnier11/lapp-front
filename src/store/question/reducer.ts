import { combineReducers } from 'redux';
import { Action } from './actions';
import {
  QuestionState,
  defaultQuestionState,
  QuestionActionTypes
} from './types';
// States' definition

const question = (
  questionState: QuestionState = defaultQuestionState,
  action: Action
): QuestionState => {
  switch (action.type) {
    case QuestionActionTypes.ACTION_STARTED: {
      return {
        ...questionState,
        loading: true
      };
    }
    case QuestionActionTypes.ACTION_FAILURE: {
      return {
        ...questionState,
        loading: false
      };
    }

    case QuestionActionTypes.CREATE: {
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

    case QuestionActionTypes.UPDATE: {
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

    case QuestionActionTypes.REMOVE: {
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

    case QuestionActionTypes.GETALL: {
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

export default question;
