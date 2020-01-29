import { QuestionTemplate } from '../../api/classes/questionTemplate.class';

// Use `enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export enum QuestionTemplatesActionTypes {
  ACTION_STARTED = '@@questionTemplate/ACTION_STARTED',
  ACTION_FAILURE = '@@questionTemplate/ACTION_FAILURE',
  CREATE = '@@questionTemplate/CREATE',
  UPDATE = '@@questionTemplate/UPDATE',
  REMOVE = '@@questionTemplate/REMOVE',
  GETALL = '@@questionTemplate/GETALL'
}

// Declare state types with `readonly` modifier to get compile time immutability.
// https://github.com/piotrwitek/react-redux-typescript-guide#state-with-type-level-immutability
export interface QuestionTemplatesState {
  readonly questionTemplates?: QuestionTemplate[];
  readonly loading: boolean;
  readonly isStarting: boolean;
}

export const defaultQuestionTemplatesState: QuestionTemplatesState = {
  loading: false,
  isStarting: true
};
