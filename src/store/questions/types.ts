import { Question } from '../../api/classes/question.class';

// Use `enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export enum QuestionsActionTypes {
  ACTION_STARTED = '@@question/ACTION_STARTED',
  ACTION_FAILURE = '@@question/ACTION_FAILURE',
  CREATE = '@@question/CREATE',
  UPDATE = '@@question/UPDATE',
  REMOVE = '@@question/REMOVE',
  GETALL = '@@question/GETALL'
}

// Declare state types with `readonly` modifier to get compile time immutability.
// https://github.com/piotrwitek/react-redux-typescript-guide#state-with-type-level-immutability
export interface QuestionsState {
  readonly questions?: Question[];
  readonly loading: boolean;
}

export const defaultQuestionsState: QuestionsState = { loading: false };
