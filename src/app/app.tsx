import React from 'react';

import { Switch, Route } from 'react-router';

import Header from './components/header/header.component';
//import Loading from './components/loading/loading.component';
import Login from './pages/auth/login/login.page';
import Home from './pages/home/home.component';
import Guard from './components/guard/guard.component';
import Footer from './components/footer/footer.component';
import Error from './components/error/error.component';
import { connect } from 'react-redux';
import { RootState } from '../store';
import { ThunkDispatch } from 'redux-thunk';
import { relog } from '../store/user/actions';
import { CssBaseline } from '@material-ui/core';

interface OwnProps {}

interface DispatchProps {
  relog: () => void;
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
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />

        <Header />
        <Switch>
          <Guard minimalPermission={0} path="/home" redirect="/patate">
            <Home />
          </Guard>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            register
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
    userState: states.user.user
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    relog: async () => {
      await dispatch(relog(false));
    }
  };
};

export default connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps
)(App);
