import React, { useEffect, useState } from 'react';

import { RouterProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Link } from 'react-router-dom';
import {
  Container,
  Avatar,
  Box,
  Typography,
  makeStyles,
  TextField,
  Button,
  CircularProgress
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { LoginCredentials } from '../../../../api/classes/user.class';
import { UserState } from '../../../../store/user/types';
import { RootState } from '../../../../store';
import { logout, login } from '../../../../store/user/actions';
import { IdVice } from '../../../components/user/idVice.component';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  noLogin: {
    cursor: 'pointer'
  },
  register: {
    paddingTop: theme.spacing(1)
  }
}));

interface OwnProps {}

interface DispatchProps {
  login: (credentials: LoginCredentials) => Promise<any>;
  logout: (hideSuccess?: boolean) => void;
}

interface StateProps {
  userState: UserState;
}

type LoginPageProps = OwnProps & DispatchProps & StateProps & RouterProps;

const LoginPage: React.FunctionComponent<LoginPageProps> = props => {
  useEffect(() => {
    if (props.userState.user) props.logout(true);
  }, []);

  const classes = useStyles();

  const loading = props.userState.loading;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    props
      .login({
        email,
        password
      })
      .then(logged => {
        if (logged) props.history.push('/home');
      });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  return (
    <Container component="div" maxWidth="xs" className={classes.paper}>
      <Avatar>
        <LockOutlinedIcon />
      </Avatar>
      <Box margin={0.5}>
        <Typography variant="h4">Sign in</Typography>
      </Box>

      <form noValidate onSubmit={handleFormSubmit}>
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
          onChange={handleEmailChange}
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
          onChange={handlePasswordChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
          className={classes.submit}
        >
          {loading && <CircularProgress size={24} color="inherit" />}
          {!loading && 'Sign In'}
        </Button>
        <IdVice />
        <Typography align="center" className={classes.register}>
          <u>
            <Link to="/register">Register</Link>
          </u>
        </Typography>
      </form>
    </Container>
  );
};

const mapStateToProps = (states: RootState): StateProps => {
  return {
    userState: states.userState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>
): DispatchProps => {
  return {
    login: async (credentials: LoginCredentials) => {
      return await dispatch(login(credentials));
    },
    logout: async (hideSuccess?: boolean) => {
      await dispatch(logout(hideSuccess));
    }
  };
};

export const Login = withRouter(
  connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { forwardRef: true }
  )(LoginPage)
);
