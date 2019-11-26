import React, { ReactChild, ReactPortal, ReactFragment } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Link } from 'react-router-dom';
import { Route, Redirect } from 'react-router-dom';
import { RootState } from '../../store';
import { UserState } from '../../store/user/types';

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

interface DispatchProps {}

interface StateProps {
  userState: UserState;
}

type Props = StateProps & OwnProps & DispatchProps;

const Guard: React.FunctionComponent<Props> = (props: Props) => {
  let user = props.userState.user;

  return (
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
    userState: states.user.user
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {};
};

export default connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps
)(Guard);
