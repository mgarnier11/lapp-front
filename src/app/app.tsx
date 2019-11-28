import React from 'react';

import { Switch, Route } from 'react-router';

import Header from './components/header/header.component';
//import Loading from './components/loading/loading.component';
import Login from './pages/auth/login/login.page';
import Register from './pages/auth/register/register.page';
import Home from './pages/home/home.page';
import Guard from './components/guard/guard.component';
import Footer from './components/footer/footer.component';
import Error from './components/error/error.component';
import Roles from './pages/roles/roles.page';
import { connect } from 'react-redux';
import { RootState } from '../store';
import { ThunkDispatch } from 'redux-thunk';
import { relog } from '../store/user/actions';
import { CssBaseline } from '@material-ui/core';
import { roleGetAll } from '../store/role/actions';

interface OwnProps {}

interface DispatchProps {
  relog: () => void;
  roleGetAll: () => void;
}

interface StateProps {}

type Props = StateProps & OwnProps & DispatchProps;

interface State {}

class App extends React.Component<Props, State> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);
    this.state = {};

    this.props.relog();
    this.props.roleGetAll();
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />

        <Header />
        <Switch>
          <Guard minimalPermission={0} path="/home" redirect="/">
            <Home />
          </Guard>
          <Guard minimalPermission={100} path="/roles" redirect="/home">
            <Roles />
          </Guard>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
        </Switch>
        <Footer />
        <Error />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    userState: states.userState.user
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    relog: async () => {
      await dispatch(relog(false));
    },
    roleGetAll: async () => {
      await dispatch(roleGetAll());
    }
  };
};

export default connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps
)(App);
