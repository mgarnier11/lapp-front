import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import user, { State as UserState } from './user/reducer';
import global, { State as GlobalState } from './global/reducer';
import thunk from 'redux-thunk';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export interface RootState {
  user: UserState;
  global: GlobalState;
}

export default createStore(
  combineReducers<RootState>({
    user,
    global
  }),
  composeEnhancers(applyMiddleware(thunk))
);
