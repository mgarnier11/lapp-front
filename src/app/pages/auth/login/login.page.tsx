import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { ThunkDispatch } from 'redux-thunk';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {
  Container,
  CssBaseline,
  Avatar,
  TextField,
  Grid,
  Link
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';

import { UserState } from '../../../../store/user/types';
import { RootState } from '../../../../store';
import { LoginCredentials } from '../../../../api/classes/user.class';
import { login, logout } from '../../../../store/user/actions';
import { useStyle } from '../../../components/useStyle.hoc';
import { styles } from './login.component.style';
import { RouterProps } from 'react-router';

interface OwnProps {
  classes: any;
}

interface DispatchProps {
  login: (credentials: LoginCredentials) => void;
  logout: () => void;
}

interface StateProps {
  userState: UserState;
}

type Props = StateProps & OwnProps & DispatchProps & RouterProps;

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

    this.props.logout();
  }

  onFormLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    this.props.login({
      email: this.state.email,
      password: this.state.password
    });
  };

  handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: e.target.value });
  };

  componentDidUpdate() {
    if (this.props.userState.user) {
      this.props.history.push('/home');
    }
  }

  render() {
    const classes = this.props.classes;
    let { email, password } = this.state;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form
            className={classes.form}
            noValidate
            onSubmit={this.onFormLoginSubmit}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={this.handleEmailChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={this.handlePasswordChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
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
    login: async (credentials: LoginCredentials) => {
      await dispatch(login(credentials));
    },
    logout: async () => {
      await dispatch(logout());
    }
  };
};

export default withRouter(
  useStyle(
    connect<StateProps, DispatchProps, OwnProps, RootState>(
      mapStateToProps,
      mapDispatchToProps
    )(Login),
    styles
  )
);
