import React, { ReactChild, ReactPortal, ReactFragment } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Route, Redirect } from 'react-router-dom';
import { RootState } from '../../../store';
import { UserState } from '../../../store/user/types';
import { relog } from '../../../store/user/actions';
//import { makeStyles } from '@material-ui/core';
import { Loading } from '../loading/loading.component';

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

const Guard: React.FunctionComponent<Props> = (props: Props) => {
  let { user, loading } = props.userState;
  //const classes = useStyles();

  return loading ? (
    <Loading />
  ) : (
    <Route
      path={props.path}
      render={() =>
        user ? (
          user.role.permissionLevel >= props.minimalPermission ? (
            <>{props.children}</>
          ) : (
            <Redirect to={props.redirect} />
          )
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    userState: states.userState.user
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

export default connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps
)(Guard);
