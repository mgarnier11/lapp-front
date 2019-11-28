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
  Checkbox,
  Switch
} from '@material-ui/core';
import { withRouter, Link } from 'react-router-dom';

import { UserState } from '../../../../store/user/types';
import { RootState } from '../../../../store';
import { LoginCredentials, User } from '../../../../api/classes/user.class';
import { login, logout, register } from '../../../../store/user/actions';
import { useStyle } from '../../../components/useStyle.hoc';
import { styles } from './register.page.style';
import { RouterProps } from 'react-router';
import { Role } from '../../../../api/classes/role.class';
import { roleGetAll } from '../../../../store/role/actions';
import { RoleState } from '../../../../store/role/types';
import { addError } from '../../../../store/error/actions';
import { withSnackbar, WithSnackbarProps } from 'notistack';

interface OwnProps {
  classes: any;
}

interface DispatchProps {
  register: (userDatas: Partial<User>) => Promise<any>;
  logout: () => void;
  roleGetAll: () => void;
  addError: (error: any) => void;
}

interface StateProps {
  userState: UserState;
  roleState: RoleState;
}

type Props = StateProps &
  OwnProps &
  DispatchProps &
  RouterProps &
  WithSnackbarProps;

interface ComponentState {
  email: string;
  password: string;
  name: string;
  roleId: string;
  gender: number;
}

class Register extends React.Component<Props, ComponentState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      name: '',
      roleId: '',
      gender: 0
    };

    this.props.logout();
  }

  onFormRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (this.state.email && this.state.name && this.state.password) {
      this.props
        .register({
          email: this.state.email,
          name: this.state.name,
          password: this.state.password,
          role: Role.New({ id: this.state.roleId }),
          gender: this.state.gender
        })
        .then(registered => {
          if (registered) {
            this.props.enqueueSnackbar(
              'Successfully registered, you can now log in',
              {
                variant: 'success'
              }
            );

            this.props.history.push('/login');
          }
        });
    } else {
      let message = 'not defined';

      if (!this.state.password) message = 'password ' + message;
      if (!this.state.email) message = 'email ' + message;
      if (!this.state.name) message = 'name ' + message;

      this.props.addError({ message, code: 1 });
    }
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

  handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ gender: e.target.checked ? 1 : 0 });
  };

  componentDidUpdate() {
    if (this.state.roleId === '') {
      if (this.props.roleState.roles) {
        let role = this.props.roleState.roles.find(r => r.name === 'user');

        if (role) {
          this.setState({
            roleId: role.id
          });
        }
      } else {
        if (!this.props.roleState.loading) this.props.roleGetAll();
      }
    }
  }

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
          <form
            className={classes.form}
            noValidate
            onSubmit={this.onFormRegisterSubmit}
          >
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
              <Grid item xs={12}>
                <Typography align="center">
                  Men
                  <Switch
                    color="primary"
                    value={gender !== 0}
                    onChange={this.handleGenderChange}
                  />
                  Women
                </Typography>
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
    userState: states.userState.user,
    roleState: states.roleState.role
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    register: async (userDatas: Partial<Role>) => {
      return await dispatch(register(userDatas));
    },
    logout: async () => {
      await dispatch(logout());
    },
    roleGetAll: async () => {
      await dispatch(roleGetAll());
    },
    addError: async (error: any) => {
      await dispatch(addError(error));
    }
  };
};

export default withRouter(
  useStyle(
    connect<StateProps, DispatchProps, OwnProps, RootState>(
      mapStateToProps,
      mapDispatchToProps
    )(withSnackbar(Register)),
    styles
  )
);
