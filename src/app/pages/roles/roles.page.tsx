import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Container } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { RoleState } from '../../../store/role/types';
import { RootState } from '../../../store';
import { roleGetAll } from '../../../store/role/actions';
import { addError } from '../../../store/error/actions';
import { useStyle } from '../../components/useStyle.hoc';
import { styles } from './roles.page.style';

interface OwnProps {
  classes: any;
}

interface DispatchProps {
  roleGetAll: () => void;
  addError: (error: any) => void;
}

interface StateProps {
  roleState: RoleState;
}

type Props = StateProps & OwnProps & DispatchProps & WithSnackbarProps;

interface ComponentState {}

class Register extends React.Component<Props, ComponentState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render() {
    const classes = this.props.classes;

    return (
      <Container component="main" maxWidth="xs">
        roles
      </Container>
    );
  }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    roleState: states.roleState.role
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    roleGetAll: async () => {
      await dispatch(roleGetAll());
    },
    addError: async (error: any) => {
      await dispatch(addError(error));
    }
  };
};

export default useStyle(
  connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
  )(withSnackbar(Register)),
  styles
);
