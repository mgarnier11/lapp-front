import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';

import { store } from './store';
import App from './app/app';
import * as serviceWorker from './serviceWorker';

import ThemeManager, { themeManagerRef } from './app/theme/themeManager';

setTimeout(() => {
  console.log('ok');
}, 5000);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeManager ref={themeManagerRef}>
        <SnackbarProvider maxSnack={10}>
          <App />
        </SnackbarProvider>
      </ThemeManager>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
