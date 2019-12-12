import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import user, { State as UserState } from './user/reducer';
import error, { State as ErrorState } from './error/reducer';
import role, { State as RoleState } from './role/reducer';
import questionType, {
  State as QuestionTypeState
} from './questionType/reducer';
import question, { State as QuestionState } from './question/reducer';
import gameType, { State as GameTypeState } from './gameType/reducer';

import thunk from 'redux-thunk';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export interface RootState {
  userState: UserState;
  errorState: ErrorState;
  roleState: RoleState;
  questionTypeState: QuestionTypeState;
  questionState: QuestionState;
  gameTypeState: GameTypeState;
}

const rootReducer = combineReducers({
  userState: user,
  errorState: error,
  roleState: role,
  questionTypeState: questionType,
  questionState: question,
  gameTypeState: gameType
});

export const store = createStore(
  /*
  combineReducers<RootState>({
    userState: user,
    errorState: error,
    roleState: role,
    questionTypeState: questionType,
    questionState: question,
    gameTypeState: gameType
  })*/
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);
