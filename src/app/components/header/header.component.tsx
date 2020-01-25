import React from 'react';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import { ThunkDispatch } from 'redux-thunk';
import { makeStyles } from '@material-ui/core';

import { UserState } from '../../../store/user/types';
import { RootState } from '../../../store';
import { logout } from '../../../store/user/actions';
import { ToolbarMobile } from './toolbar.mobile';

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 100
  }
}));

interface OwnProps {}

interface DispatchProps {
  logout: (hideSuccess?: boolean) => Promise<any>;
}

interface StateProps {
  userState: UserState;
}

type Props = StateProps & OwnProps & DispatchProps;

const HeaderComponent: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  const user = props.userState.user;

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <ToolbarMobile user={user} logout={props.logout} />
    </AppBar>
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
    logout: async (hideSuccess?: boolean) => {
      return await dispatch(logout(hideSuccess));
    }
  };
};

export const Header = connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps
)(HeaderComponent);

export const headerHeight = 64;
