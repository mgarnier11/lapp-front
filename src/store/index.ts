import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import user from './user/reducer';
import error from './error/reducer';
import role from './role/reducer';
import questionType from './questionType/reducer';
import question from './question/reducer';
import gameType from './gameType/reducer';
import game from './game/reducer';

import thunk from 'redux-thunk';
import { UserState } from './user/types';
import { ErrorState } from './error/types';
import { QuestionTypeState } from './questionType/types';
import { QuestionState } from './question/types';
import { GameTypeState } from './gameType/types';
import { RoleState } from './role/types';
import { GameState } from './game/types';

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
  gameState: GameState;
}

const rootReducer = combineReducers<RootState>({
  userState: user,
  errorState: error,
  roleState: role,
  questionTypeState: questionType,
  questionState: question,
  gameTypeState: gameType,
  gameState: game
});

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);
