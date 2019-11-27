import React from 'react';

import { Switch, Route } from 'react-router';

import apiHandler from '../api/apiHandler';
import Header from './components/header/header.component';

import Login from './pages/auth/login/login.page';
import Home from './pages/home/home.component';
import Guard from './components/guard.component';
import Footer from './components/footer/footer.component';
import Error from './components/error.component';
import { connect } from 'react-redux';
import { RootState } from '../store';
import { ThunkDispatch } from 'redux-thunk';
import { relog } from '../store/user/actions';

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
        <Header />
        <Switch>
          <Guard minimalPermission={10} path="/home" redirect="/patate">
            <Home />
          </Guard>
          <Route exact path="/login">
            <Login />
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
      await dispatch(relog());
    }
  };
};

export default connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps
)(App);
