import React, { ReactChild, ReactPortal, ReactFragment } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Route, Redirect } from 'react-router-dom';
import { RootState } from '../../../store';
import { UserState } from '../../../store/user/types';
import { relog } from '../../../store/user/actions';
//import { makeStyles } from '@material-ui/core';
import { Loading } from '../loading/loading.component';
import { render } from 'react-dom';

/*
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2)
    },
    justifyContent: 'center',
    paddingTop: theme.spacing(2)
  }
}));
*/
interface OwnProps {
  path: string;
  redirect: string;
  minimalPermission: number;
  idViceAllowed?: boolean;
  children:
    | ReactChild
    | ReactFragment
    | ReactPortal
    | boolean
    | null
    | undefined;
}

interface DispatchProps {
  relog: () => void;
}

interface StateProps {
  userState: UserState;
}

type Props = StateProps & OwnProps & DispatchProps;

const GuardComponent: React.FunctionComponent<Props> = (props: Props) => {
  const idViceAllowed =
    props.idViceAllowed === undefined ? true : props.idViceAllowed;
  const { minimalPermission, children, redirect } = props;
  const { user, loading } = props.userState;
  //const classes = useStyles();

  const renderRoute = () => {
    if (user) {
      if (
        isNaN(minimalPermission) ||
        user.role.permissionLevel >= minimalPermission
      ) {
        if (user.isIDVice() && !idViceAllowed) {
          return <Redirect to={props.redirect} />;
        }
        return <>{props.children}</>;
      } else {
        return <Redirect to={props.redirect} />;
      }
    } else {
      return <Redirect to="/login" />;
    }
  };

  if (loading) {
    return <Loading />;
  } else {
    return <Route path={props.path} render={renderRoute} />;
  }
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
    relog: async () => {
      dispatch(relog(false));
    }
  };
};

export const Guard = connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps
)(GuardComponent);
