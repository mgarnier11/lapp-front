import React from 'react';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { ThunkDispatch } from 'redux-thunk';
import { Link } from 'react-router-dom';
import { UserState } from '../../../../store/user/types';
import { RootState } from '../../../../store';
import { LoginCredentials } from '../../../../api/classes/user.class';
import { login } from '../../../../store/user/actions';
import { useStyle } from '../../../components/useStyle.hoc';
import { styles } from './login.component.style';

interface OwnProps {
  classes: any;
}

interface DispatchProps {
  login: (credentials: LoginCredentials) => void;
}

interface StateProps {
  userState: UserState;
}

type Props = StateProps & OwnProps & DispatchProps;

interface ComponentState {
  email: string;
  password: string;
}

class Login extends React.Component<Props, ComponentState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
  }

  render() {
    return <>ok</>;
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
    login: async (credentials: LoginCredentials) => {
      await dispatch(login(credentials));
    }
  };
};

export default useStyle(
  connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
  )(Login),
  styles
);
