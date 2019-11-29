import * as lodash from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Container } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import MaterialTable, { Column } from 'material-table';
import { RoleState } from '../../../store/role/types';
import { RootState } from '../../../store';
import {
  roleGetAll,
  roleCreate,
  roleUpdate,
  roleRemove
} from '../../../store/role/actions';
import { addError } from '../../../store/error/actions';
import { useStyle } from '../../components/useStyle.hoc';
import { styles } from './roles.page.style';
import { Role } from '../../../api/classes/role.class';
import { Loading } from '../../components/loading/loading.component';

interface OwnProps {
  classes: any;
}

interface DispatchProps {
  roleCreate: (role: Partial<Role>) => Promise<any>;
  roleUpdate: (role: Role) => Promise<any>;
  roleRemove: (roleId: string) => Promise<any>;
  roleGetAll: () => void;
  addError: (error: any) => void;
}

interface StateProps {
  roleState: RoleState;
}

type Props = StateProps & OwnProps & DispatchProps & WithSnackbarProps;

interface ComponentState {
  columns: Array<Column<Role>>;
  roles: Role[];
}

class Roles extends React.Component<Props, ComponentState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      columns: [
        { title: 'Name', field: 'name' },
        { title: 'Icon', field: 'icon' },
        {
          title: 'Permission Level',
          field: 'permissionLevel',
          type: 'numeric',
          emptyValue: '0'
        }
      ],
      roles: []
    };
  }

  componentDidUpdate() {
    if (!this.props.roleState.roles && !this.props.roleState.loading) {
      this.props.roleGetAll();
    }
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: ComponentState) {
    let nextRoles = nextProps.roleState.roles;
    if (nextRoles) {
      let prevRoles = prevState.roles;

      if (!Role.CompareArrays(nextRoles, prevRoles)) {
        return {
          roles: lodash.cloneDeep(nextRoles)
        };
      }
    }

    return null;
  }

  render() {
    const classes = this.props.classes;

    return (
      <Container component="main" className={classes.root}>
        {this.props.roleState.roles
          ? this.renderTable(this.state.roles)
          : this.renderLoading()}
      </Container>
    );
  }

  renderTable(roles: Role[]) {
    return (
      <MaterialTable
        title="Role Table"
        columns={this.state.columns}
        data={roles}
        editable={{
          onRowAdd: newData =>
            new Promise(async (resolve, reject) => {
              let newRole = Role.New(newData);
              let created = await this.props.roleCreate(newRole);
              if (created) resolve();
              else reject();
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise(async (resolve, reject) => {
              if ((newData as any).permissionLevel.length > 0)
                newData.permissionLevel = parseInt(
                  (newData as any).permissionLevel
                );
              let updatedRole = Role.New(newData);
              let updated = await this.props.roleUpdate(updatedRole);
              if (updated) resolve();
              else reject();
            }),
          onRowDelete: oldData =>
            new Promise(async (resolve, reject) => {
              let deleted = await this.props.roleRemove(oldData.id);
              if (deleted) resolve();
              else reject();
            })
        }}
        options={{ pageSize: 10, pageSizeOptions: [10] }}
      />
    );
  }

  renderLoading() {
    return <Loading />;
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
    roleCreate: async (role: Partial<Role>) => {
      return await dispatch(roleCreate(role));
    },
    roleUpdate: async (role: Role) => {
      return await dispatch(roleUpdate(role));
    },
    roleRemove: async (roleId: string) => {
      return await dispatch(roleRemove(roleId));
    },
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
  )(withSnackbar(Roles)),
  styles
);
