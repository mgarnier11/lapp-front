import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Box, Fab, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import { RolesState } from '../../../store/roles/types';
import { RootState } from '../../../store';
import { RolesActions } from '../../../store/roles/actions';
import { Role } from '../../../api/classes/role.class';
import { Loading } from '../../components/utils/loading.component';
import { RoleList } from '../../components/role/role.list.component';
import { yesNoController } from '../../components/dialogs/yesno.component';
import { RoleDialog } from '../../components/role/role.dialog.component';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(10),
    paddingTop: theme.spacing(1),
  },
}));

interface OwnProps {}

interface DispatchProps {
  roleCreate: (questionTempalte: Role) => Promise<any>;
  roleUpdate: (role: Role) => Promise<any>;
  roleRemove: (roleId: string) => Promise<any>;
}

interface StateProps {
  rolesState: RolesState;
}

type Props = StateProps & OwnProps & DispatchProps;

interface ModalProps {
  open: boolean;
  role: Role;
  title?: string;
  onAccept?: (role: Role) => void;
  submitButtonText?: string;
}

const RolesPage: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  const [modalProps, setModalProps] = useState({
    open: false,
    role: Role.New({}),
  } as ModalProps);

  console.log(modalProps);

  const openModal = () => setModalProps({ ...modalProps, open: true }); // eslint-disable-line

  const closeModal = () => setModalProps({ ...modalProps, open: false });

  const handleUpdate = (updatedRole: Role) => {
    closeModal();

    props.roleUpdate(updatedRole);
  };

  const handleCreate = (createdRole: Role) => {
    closeModal();

    props.roleCreate(createdRole);
  };

  const handleOnUpdate = (clickedRole: Role) => {
    setModalProps({
      open: true,
      onAccept: handleUpdate,
      role: clickedRole,
      title: 'Edit type',
      submitButtonText: 'Confirm update',
    });
  };

  const handleOnCreate = () => {
    setModalProps({
      open: true,
      onAccept: handleCreate,
      role: Role.New({}),
      title: 'Create a new type',
      submitButtonText: 'Create',
    });
  };

  const handleOnDelete = (roleId: string) => {
    yesNoController()!
      .present({
        title: 'Are you sure you want to delete this type\u00a0?',
        acceptText: 'Yes',
        denyText: 'No',
      })
      .then(() => {
        props.roleRemove(roleId);
      })
      .catch((error) => {
        //this.props.addError(error);
      });
  };

  return (
    <>
      <Box component="div" className={classes.root}>
        <Typography component="h2" variant="h5" align="center">
          Roles
        </Typography>
        {props.rolesState.roles ? (
          <RoleList
            roles={props.rolesState.roles}
            onUpdate={handleOnUpdate}
            onDelete={handleOnDelete}
          />
        ) : (
          <Loading />
        )}
      </Box>
      <Fab
        className="floating-action-button"
        onClick={handleOnCreate}
        style={{ zIndex: 10 }}
      >
        <AddIcon />
      </Fab>

      <RoleDialog
        dialogProps={{
          open: modalProps.open,
          onClose: closeModal,
        }}
        role={modalProps.role}
        editable
        title={modalProps.title}
        acceptButtonText={modalProps.submitButtonText}
        onAccept={modalProps.onAccept}
      />
    </>
  );
};

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    rolesState: states.rolesState,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    roleCreate: async (role: Role) => {
      return await dispatch(RolesActions.roleCreate(role));
    },
    roleUpdate: async (role: Role) => {
      return await dispatch(RolesActions.roleUpdate(role));
    },
    roleRemove: async (roleId: string) => {
      return await dispatch(RolesActions.roleRemove(roleId));
    },
  };
};

export const Roles = connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps
)(RolesPage);
