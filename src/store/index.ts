import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import user from './user/reducer';
import { errors } from './errors/reducer';
import { roles } from './roles/reducer';
import { questionTypes } from './questionTypes/reducer';
import { questions } from './questions/reducer';
import { gameTypes } from './gameTypes/reducer';
import { games } from './games/reducer';
import { game } from './game/reducer';

import thunk from 'redux-thunk';
import { UserState } from './user/types';
import { ErrorsState } from './errors/types';
import { QuestionTypesState } from './questionTypes/types';
import { QuestionsState } from './questions/types';
import { GameTypesState } from './gameTypes/types';
import { RolesState } from './roles/types';
import { GamesState } from './games/types';
import { GameState } from './game/types';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export interface RootState {
  userState: UserState;
  errorsState: ErrorsState;
  rolesState: RolesState;
  questionTypesState: QuestionTypesState;
  questionsState: QuestionsState;
  gameTypesState: GameTypesState;
  gamesState: GamesState;
  gameState: GameState;
}

const rootReducer = combineReducers<RootState>({
  userState: user,
  errorsState: errors,
  rolesState: roles,
  questionTypesState: questionTypes,
  questionsState: questions,
  gameTypesState: gameTypes,
  gamesState: games,
  gameState: game
});

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);
