import React from 'react';
import Header from './components/header/header.component';

import { Switch, Route } from 'react-router';

import apiHandler from '../api/apiHandler';
import Login from './pages/auth/login/login.page';
import Home from './pages/home/home.component';
import Guard from './components/guard.component';

interface StateProps {}

type Props = StateProps;

interface State {}

class App extends React.Component<Props, State> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <Header></Header>
        <Switch>
          <Guard minimalPermission={10} path="/home" redirect="/patate">
            <Home />
          </Guard>
          <Route exact path="/login">
            <Login />
          </Route>
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
