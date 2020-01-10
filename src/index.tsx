import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';

import { store } from './store';
import App from './app/app';
import * as serviceWorker from './serviceWorker';
import { ThemeProvider, colors } from '@material-ui/core';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import ThemeManager, { themeManagerRef } from './app/themeManager';

const theme = createMuiTheme({
  palette: {
    type: 'light'
    /*
    primary: { main: '#A21CFF', dark: '#510E80', light: '#C169FF' },
    secondary: { main: colors.lightBlue[400] }

    
    background: { default: colors.grey[600] },
    text: { primary: colors.grey[50] }
    */
  }
});

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
