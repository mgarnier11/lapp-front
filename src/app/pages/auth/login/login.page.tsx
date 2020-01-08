import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { ThunkDispatch } from 'redux-thunk';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {
  Container,
  Avatar,
  TextField,
  Grid,
  CircularProgress
} from '@material-ui/core';
import { withRouter, Link } from 'react-router-dom';
import { RouterProps } from 'react-router';
import {
  StyleRules,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';

import { UserState } from '../../../../store/user/types';
import { RootState } from '../../../../store';
import { LoginCredentials, User } from '../../../../api/classes/user.class';
import { login, logout, register } from '../../../../store/user/actions';
import apiHandler from '../../../../api/apiHandler';
import uuid from 'uuid';
import { Helper } from '../../../../helper';
import { IdVice } from '../../../components/user/idVice.component';

const styles = (theme: Theme): StyleRules => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  noLogin: {
    cursor: 'pointer'
  }
});

interface OwnProps {}

interface DispatchProps {
  login: (credentials: LoginCredentials) => Promise<any>;
  logout: () => void;
}

interface StateProps {
  userState: UserState;
}

type Props = StateProps &
  OwnProps &
  DispatchProps &
  RouterProps &
  WithStyles<typeof styles>;

interface ComponentState {
  email: string;
  password: string;
}

class LoginPage extends React.Component<Props, ComponentState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };

    if (this.props.userState.user) this.props.logout();
  }

  onFormLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    this.props
      .login({
        email: this.state.email,
        password: this.state.password
      })
      .then(logged => {
        if (logged) this.props.history.push('/home');
      });
  };

  handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: e.target.value });
  };

  render() {
    const classes = this.props.classes;
    const loading = this.props.userState.loading;
    let { email, password } = this.state;

    return (
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h4">Sign in</Typography>
          <IdVice />

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
              disabled={loading}
              className={classes.submit}
            >
              {loading && <CircularProgress size={24} />}
              {!loading && 'Sign In'}
            </Button>
            <Typography align="center" color="primary">
              <u>
                <Link to="/register">Don't have an account ? Register</Link>
              </u>
            </Typography>
          </form>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    userState: states.userState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    login: async (credentials: LoginCredentials) => {
      return await dispatch(login(credentials));
    },
    logout: async () => {
      await dispatch(logout());
    }
  };
};

export const Login = withRouter(
  connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(LoginPage))
);
