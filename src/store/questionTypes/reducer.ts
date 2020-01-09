import { Action } from './actions';
import {
  QuestionTypesState,
  defaultQuestionTypesState,
  QuestionTypesActionTypes
} from './types';
// States' definition

export const questionTypes = (
  questionTypeState: QuestionTypesState = defaultQuestionTypesState,
  action: Action
): QuestionTypesState => {
  switch (action.type) {
    case QuestionTypesActionTypes.ACTION_STARTED: {
      return {
        ...questionTypeState,
        loading: true
      };
    }
    case QuestionTypesActionTypes.ACTION_FAILURE: {
      return {
        ...questionTypeState,
        loading: false
      };
    }

    case QuestionTypesActionTypes.CREATE: {
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

    case QuestionTypesActionTypes.UPDATE: {
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

    case QuestionTypesActionTypes.REMOVE: {
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

    case QuestionTypesActionTypes.GETALL: {
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

export default questionTypes;
