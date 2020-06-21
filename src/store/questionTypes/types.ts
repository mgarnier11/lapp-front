import { QuestionType } from '../../api/classes/questionType.class';

// Use `enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export enum QuestionTypesActionTypes {
  ACTION_STARTED = '@@questionType/ACTION_STARTED',
  ACTION_FAILURE = '@@questionType/ACTION_FAILURE',
  CREATE = '@@questionType/CREATE',
  UPDATE = '@@questionType/UPDATE',
  REMOVE = '@@questionType/REMOVE',
  GETALL = '@@questionType/GETALL'
}

// Declare state types with `readonly` modifier to get compile time immutability.
// https://github.com/piotrwitek/react-redux-typescript-guide#state-with-type-level-immutability
export interface QuestionTypesState {
  readonly questionTypes?: QuestionType[];
  readonly loading: boolean;
  readonly isStarting: boolean;
}

export const defaultQuestionTypesState: QuestionTypesState = {
  loading: false,
  isStarting: true
};
