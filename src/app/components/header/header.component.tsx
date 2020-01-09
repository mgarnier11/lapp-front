import React from 'react';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import { ThunkDispatch } from 'redux-thunk';
import { Link } from 'react-router-dom';
import { makeStyles, Hidden, CssBaseline } from '@material-ui/core';

import { UserState } from '../../../store/user/types';
import { RootState } from '../../../store';
import { logout } from '../../../store/user/actions';
import { ToolbarMobile } from './toolbar.mobile';
import { ToolbarDesktop } from './toolbar.desktop';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '64px'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1000
  },
  title: {
    flexGrow: 1
  },
  userName: {
    marginRight: '5px'
  },
  button: {
    marginRight: '5px',
    marginLeft: '5px',
    color: 'inherit',
    textDecoration: 'none'
  },
  drawerPaper: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: 0
  },
  toolbar: theme.mixins.toolbar
}));

interface OwnProps {}

interface DispatchProps {
  logout: () => void;
}

interface StateProps {
  userState: UserState;
}

type Props = StateProps & OwnProps & DispatchProps;

const HeaderComponent: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  const user = props.userState.user;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        {user ? (
          <>
            <Hidden mdUp>
              <ToolbarMobile
                user={user}
                classes={classes}
                logout={props.logout}
              />
            </Hidden>
            <Hidden smDown>
              <ToolbarDesktop
                user={user}
                classes={classes}
                logout={props.logout}
              />
            </Hidden>
          </>
        ) : (
          <Typography align="center">
            <Link to="/login" className={classes.button}>
              <Button className={classes.button}>Login</Button>
            </Link>
            <Link to="/register" className={classes.button}>
              <Button className={classes.button}>Register</Button>
            </Link>
          </Typography>
        )}
      </AppBar>
    </div>
  );
};

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
    logout: async () => {
      await dispatch(logout());
    }
  };
};

export const Header = connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps
)(HeaderComponent);

export const renderUser = (props: any) => {
  return (
    <>
      <Typography>{props.user.name}</Typography>
      {!props.user.isIDVice() && (
        <Link to="/me" style={{ zIndex: 1200 }}>
          <IconButton
            color="inherit"
            className={props.classes.button}
            edge="end"
          >
            <PermIdentityIcon />
          </IconButton>
        </Link>
      )}

      <IconButton
        edge="end"
        color="inherit"
        onClick={props.logout}
        className={props.classes.button}
        style={{ zIndex: 1200 }}
      >
        <ExitToAppIcon />
      </IconButton>
    </>
  );
};
