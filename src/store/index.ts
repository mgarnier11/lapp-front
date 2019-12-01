import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import user, { State as UserState } from './user/reducer';
import error, { State as ErrorState } from './error/reducer';
import role, { State as RoleState } from './role/reducer';
import questionType, {
  State as QuestionTypeState
} from './questionType/reducer';
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
}

export default createStore(
  combineReducers<RootState>({
    userState: user,
    errorState: error,
    roleState: role,
    questionTypeState: questionType
  }),
  composeEnhancers(applyMiddleware(thunk))
);
