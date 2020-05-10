import React, { useEffect } from 'react';

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
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { UserForm } from '../../../components/user/user.form.component';
import { User } from '../../../../api/classes/user.class';
import { UserState } from '../../../../store/user/types';
import { RootState } from '../../../../store';
import { logout, register } from '../../../../store/user/actions';
import { BaseAvatar } from '../../../components/utils/avatars.component';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  signIn: {
    paddingTop: theme.spacing(1),
  },
}));

interface OwnProps {}

interface DispatchProps {
  register: (userDatas: Partial<User>) => Promise<any>;
  logout: (hideSuccess?: boolean) => void;
}

interface StateProps {
  userState: UserState;
}

type RegisterPageProps = OwnProps & DispatchProps & StateProps & RouterProps;

const RegisterPage: React.FunctionComponent<RegisterPageProps> = (props) => {
  useEffect(() => {
    props.logout(true);
  }, []);

  const classes = useStyles();

  const handleFormSubmit = (user: User) => {
    props.register(user).then((registered) => {
      if (registered) {
        props.history.push('/login');
      }
    });
  };

  return (
    <Container component="div" maxWidth="xs" className={classes.paper}>
      <BaseAvatar
        pixelSize={80}
        src="/assets/logo_party_drink.png"
      ></BaseAvatar>
      <Box margin={0.5}>
        <Typography variant="h4">Register</Typography>
      </Box>
      <UserForm
        user={User.New({})}
        editable
        displayConfirms
        warningText="By clicking on the register button, I agree that the form datas will be stored by PartyDrink Studio"
        acceptButtonText="register"
        onSubmit={handleFormSubmit}
      />
      <Typography align="center" className={classes.signIn}>
        <u>
          <Link to="/login">Sign in</Link>
        </u>
      </Typography>
    </Container>
  );
};

const mapStateToProps = (states: RootState): StateProps => {
  return {
    userState: states.userState,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>
): DispatchProps => {
  return {
    register: async (userDatas: Partial<User>) => {
      return await dispatch(register(userDatas));
    },
    logout: async (hideSuccess?: boolean) => {
      await dispatch(logout(hideSuccess));
    },
  };
};

export const Register = withRouter(
  connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { forwardRef: true }
  )(RegisterPage)
);
