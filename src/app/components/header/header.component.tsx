import React from 'react';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HouseIcon from '@material-ui/icons/Home';
import { ThunkDispatch } from 'redux-thunk';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';

import { UserState } from '../../../store/user/types';
import { RootState } from '../../../store';
import { logout } from '../../../store/user/actions';

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  userName: {
    marginRight: '5px'
  },
  button: {
    color: 'inherit',
    textDecoration: 'none'
  }
}));

interface OwnProps {}

interface DispatchProps {
  logout: () => void;
}

interface StateProps {
  userState: UserState;
}

type Props = StateProps & OwnProps & DispatchProps;

const Header: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <Link to="/home" className={classes.button}>
            <HouseIcon />
          </Link>
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Patate
        </Typography>

        {props.userState.user ? (
          <React.Fragment>
            <Typography className={classes.userName}>
              {props.userState.user.name}
            </Typography>
            <Button
              color="inherit"
              onClick={props.logout}
              className={classes.button}
            >
              Logout
            </Button>
          </React.Fragment>
        ) : (
          <Link to="/login" className={classes.button}>
            <Button className={classes.button}>Login</Button>
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
    }
  };
};

export default connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps
)(Header);
