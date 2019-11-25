import { Reducer } from 'redux';
import { AuthState, AuthActionTypes } from './types';

// Type-safe initialState!
const initialState: AuthState = {
  loading: false,
  user: undefined
};

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
const reducer: Reducer<AuthState> = (state = initialState, action) => {
  switch (action.type) {
    case AuthActionTypes.LOGIN: {
      return state;
    }
    case AuthActionTypes.LOGOUT: {
      return state;
    }
    case AuthActionTypes.REGISTER: {
      return state;
    }
    default: {
      return state;
    }
  }
};

// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export { reducer as authReducer };
