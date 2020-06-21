import { Action } from './actions';
import {
  QuestionTemplatesState,
  defaultQuestionTemplatesState,
  QuestionTemplatesActionTypes
} from './types';
// States' definition

export const questionTemplates = (
  questionTemplateState: QuestionTemplatesState = defaultQuestionTemplatesState,
  action: Action
): QuestionTemplatesState => {
  switch (action.type) {
    case QuestionTemplatesActionTypes.ACTION_STARTED: {
      return {
        ...questionTemplateState,
        loading: true
      };
    }
    case QuestionTemplatesActionTypes.ACTION_FAILURE: {
      return {
        ...questionTemplateState,
        loading: false
      };
    }

    case QuestionTemplatesActionTypes.CREATE: {
      if (questionTemplateState.questionTemplates) {
        return {
          ...questionTemplateState,
          questionTemplates: questionTemplateState.questionTemplates.concat(
            action.questionTemplate
          ),
          loading: false
        };
      } else {
        return {
          ...questionTemplateState,
          loading: false
        };
      }
    }

    case QuestionTemplatesActionTypes.UPDATE: {
      if (questionTemplateState.questionTemplates) {
        return {
          ...questionTemplateState,
          questionTemplates: questionTemplateState.questionTemplates.map(
            questionTemplate =>
              questionTemplate.id === action.questionTemplate.id
                ? action.questionTemplate
                : questionTemplate
          ),
          loading: false
        };
      } else {
        return {
          ...questionTemplateState,
          loading: false
        };
      }
    }

    case QuestionTemplatesActionTypes.REMOVE: {
      if (questionTemplateState.questionTemplates) {
        return {
          ...questionTemplateState,
          questionTemplates: questionTemplateState.questionTemplates.filter(
            questionTemplate =>
              questionTemplate.id !== action.questionTemplate.id
          ),
          loading: false
        };
      } else {
        return {
          ...questionTemplateState,
          loading: false
        };
      }
    }

    case QuestionTemplatesActionTypes.GETALL: {
      return {
        ...questionTemplateState,
        questionTemplates: action.questionTemplates,
        loading: false,
        isStarting: false
      };
    }
    default:
      return questionTemplateState;
  }
};

export default questionTemplates;
