import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Container } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import MaterialTable, { Column } from 'material-table';
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

interface Row {
  name: string;
  surname: string;
  birthYear: number;
  birthCity: number;
}

interface ComponentState {
  columns: Array<Column<Row>>;
  data: Row[];
}

class Register extends React.Component<Props, ComponentState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      columns: [
        { title: 'Name', field: 'name' },
        {
          title: 'Permission Level',
          field: 'permissionLevel',
          type: 'numeric',
          editComponent: props => (
            <input
              type="number"
              required={true}
              value={props.value}
              onChange={e => props.onChange(e.target.value)}
            ></input>
          )
        }
      ],
      data: []
    };
  }

  render() {
    const classes = this.props.classes;

    return (
      <Container component="main">
        <MaterialTable
          title="Editable Example"
          columns={this.state.columns}
          data={this.state.data}
          editable={{
            onRowAdd: newData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  this.setState(prevState => {
                    const data = [...prevState.data];
                    data.push(newData);
                    return { ...prevState, data };
                  });
                }, 600);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  if (oldData) {
                    this.setState(prevState => {
                      const data = [...prevState.data];
                      data[data.indexOf(oldData)] = newData;
                      return { ...prevState, data };
                    });
                  }
                }, 600);
              }),
            onRowDelete: oldData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  this.setState(prevState => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                  });
                }, 600);
              })
          }}
        />
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
