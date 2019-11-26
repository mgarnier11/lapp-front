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

import { UserState } from '../../../store/user/types';
import { RootState } from '../../../store';
import { logout, login } from '../../../store/user/actions';
import { LoginCredentials } from '../../../api/classes/user.class';
import { useStyle } from '../useStyle.hoc';
import { styles } from './header.component.style';

interface OwnProps {
  classes: any;
}

interface DispatchProps {
  logout: () => void;
  login: (credentials: LoginCredentials) => void;
}

interface StateProps {
  userState: UserState;
}

type Props = StateProps & OwnProps & DispatchProps;

const Header: React.FunctionComponent<Props> = (props: Props) => {
  const classes = props.classes;

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          <Link to="/home" className={classes.logButton}>
            News
          </Link>
        </Typography>

        {props.userState.user ? (
          <React.Fragment>
            <Typography className={classes.userName}>
              {props.userState.user.name}
            </Typography>
            <Button
              color="inherit"
              onClick={props.logout}
              className={classes.logButton}
            >
              Logout
            </Button>
          </React.Fragment>
        ) : (
          <Link to="/login" className={classes.logButton}>
            <Button
              color="inherit"
              onClick={() => {
                props.login({
                  email: 'mgarnier11@gmail.com',
                  password: 'password'
                });
              }}
            >
              Login
            </Button>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
};

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
    logout: async () => {
      await dispatch(logout());
    },
    login: async (credentials: LoginCredentials) => {
      await dispatch(login(credentials));
    }
  };
};

export default useStyle(
  connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
  )(Header),
  styles
);
