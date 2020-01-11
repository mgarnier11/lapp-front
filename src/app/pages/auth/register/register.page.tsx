import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { ThunkDispatch } from 'redux-thunk';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Container, Avatar, TextField, MenuItem, Box } from '@material-ui/core';
import {
  withStyles,
  WithStyles,
  createStyles,
  StyleRules,
  Theme
} from '@material-ui/core/styles';

import { withRouter, Link } from 'react-router-dom';

import { UserState } from '../../../../store/user/types';
import { RootState } from '../../../../store';
import { User } from '../../../../api/classes/user.class';
import { logout, register } from '../../../../store/user/actions';
import { RouterProps } from 'react-router';
import { Role } from '../../../../api/classes/role.class';
import { addError } from '../../../../store/errors/actions';
import { withSnackbar, WithSnackbarProps } from 'notistack';

const styles = (theme: Theme): StyleRules =>
  createStyles({
    paper: {
      marginTop: theme.spacing(4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    submit: {
      margin: theme.spacing(3, 0, 2)
    }
  });

interface OwnProps {}

interface DispatchProps {
  register: (userDatas: Partial<User>) => Promise<any>;
  logout: () => void;
  addError: (error: any) => void;
}

interface StateProps {
  userState: UserState;
}

type Props = StateProps &
  OwnProps &
  DispatchProps &
  RouterProps &
  WithSnackbarProps &
  WithStyles<typeof styles>;

interface ComponentState {
  email: string;
  password: string;
  name: string;
  gender: number;
}

class RegisterPage extends React.Component<Props, ComponentState> {
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

    if (this.props.userState.user) this.props.logout();
  }

  onFormRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (this.state.email && this.state.name && this.state.password) {
      this.props
        .register({
          email: this.state.email,
          name: this.state.name,
          password: this.state.password,
          gender: this.state.gender
        })
        .then(registered => {
          if (registered) {
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

  handleGenderChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    this.setState({
      gender: e.target.value as number
    });
  };

  render() {
    const classes = this.props.classes;
    let { email, password, name, gender } = this.state;

    return (
      <Container component="div" maxWidth="xs" className={classes.paper}>
        <Avatar>
          <LockOutlinedIcon />
        </Avatar>
        <Box margin={0.5}>
          <Typography variant="h4">Register</Typography>
        </Box>

        <form noValidate onSubmit={this.onFormRegisterSubmit}>
          <TextField
            name="name"
            margin="normal"
            variant="outlined"
            required
            fullWidth
            id="name"
            label="Name"
            autoFocus
            value={name}
            onChange={this.handleNameChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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
            value={password}
            onChange={this.handlePasswordChange}
          />
          <TextField
            select
            label="Gender"
            margin="normal"
            id="gender-select"
            value={gender}
            fullWidth
            variant="outlined"
            onChange={this.handleGenderChange}
          >
            <MenuItem value={0}>Man</MenuItem>
            <MenuItem value={1}>Woman</MenuItem>
          </TextField>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Register
          </Button>
          <Typography align="center">
            <u>
              <Link to="/login">Sign in instead</Link>
            </u>
          </Typography>
        </form>
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
    register: async (userDatas: Partial<Role>) => {
      return await dispatch(register(userDatas));
    },
    logout: async () => {
      await dispatch(logout());
    },
    addError: async (error: any) => {
      await dispatch(addError(error));
    }
  };
};

export const Register = withRouter(
  connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withSnackbar(RegisterPage)))
);
