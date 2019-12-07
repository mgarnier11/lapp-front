import { combineReducers } from 'redux';
import { Action } from './actions';
import {
  QuestionTypeState,
  defaultQuestionTypeState,
  QuestionTypeActionTypes
} from './types';
// States' definition

export interface State {
  questionType: QuestionTypeState;
}

const questionType = (
  questionTypeState: QuestionTypeState = defaultQuestionTypeState,
  action: Action
): QuestionTypeState => {
  switch (action.type) {
    case QuestionTypeActionTypes.ACTION_STARTED: {
      return {
        ...questionTypeState,
        loading: true
      };
    }
    case QuestionTypeActionTypes.ACTION_FAILURE: {
      return {
        ...questionTypeState,
        loading: false
      };
    }

    case QuestionTypeActionTypes.CREATE: {
      if (questionTypeState.questionTypes) {
        return {
          ...questionTypeState,
          questionTypes: questionTypeState.questionTypes.concat(
            action.questionType
          ),
          loading: false
        };
      } else {
        return {
          ...questionTypeState,
          loading: false
        };
      }
    }

    case QuestionTypeActionTypes.UPDATE: {
      if (questionTypeState.questionTypes) {
        return {
          ...questionTypeState,
          questionTypes: questionTypeState.questionTypes.map(questionType =>
            questionType.id === action.questionType.id
              ? action.questionType
              : questionType
          ),
          loading: false
        };
      } else {
        return {
          ...questionTypeState,
          loading: false
        };
      }
    }

    case QuestionTypeActionTypes.REMOVE: {
      if (questionTypeState.questionTypes) {
        return {
          ...questionTypeState,
          questionTypes: questionTypeState.questionTypes.filter(
            questionType => questionType.id !== action.questionType.id
          ),
          loading: false
        };
      } else {
        return {
          ...questionTypeState,
          loading: false
        };
      }
    }

    case QuestionTypeActionTypes.GETALL: {
      return {
        ...questionTypeState,
        questionTypes: action.questionTypes,
        loading: false
      };
    }
    default:
      return questionTypeState;
  }
};

export default combineReducers<State>({
  questionType
});
