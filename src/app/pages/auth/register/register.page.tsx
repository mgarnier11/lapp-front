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
  CircularProgress,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';
import { withRouter, Link } from 'react-router-dom';

import { UserState } from '../../../../store/user/types';
import { RootState } from '../../../../store';
import { LoginCredentials } from '../../../../api/classes/user.class';
import { login, logout } from '../../../../store/user/actions';
import { useStyle } from '../../../components/useStyle.hoc';
import { styles } from './register.page.style';
import { RouterProps } from 'react-router';
import { Role } from '../../../../api/classes/role.class';

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
  name: string;
  //role: Role;
  gender: number;
}

class Login extends React.Component<Props, ComponentState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      name: '',
      gender: 0
    };

    this.props.logout();
  }

  onFormLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: e.target.value });
  };

  handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: e.target.value });
  };

  componentDidUpdate() {}

  render() {
    const classes = this.props.classes;
    const loading = this.props.userState.loading;
    let { email, password, name, gender } = this.state;

    return (
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  variant="outlined"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                  value={name}
                  onChange={this.handleNameChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={this.handleEmailChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={this.handlePasswordChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>
            <Grid container justify="flex-start">
              <Grid item>
                <Link to="/login">Already have an account? Sign in</Link>
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
