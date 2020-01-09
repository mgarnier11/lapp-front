import * as lodash from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { MenuItem, Button, TextField, FormControl } from '@material-ui/core';
import {
  withStyles,
  WithStyles,
  createStyles,
  StyleRules,
  Theme
} from '@material-ui/core/styles';

import { RootState } from '../../../store';
import { addError } from '../../../store/errors/actions';
import { DummyUser } from '../../../api/classes/dummyUser.class';
import { Helper } from '../../../helper';

const styles = (theme: Theme): StyleRules =>
  createStyles({
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center'
    },
    formControl: {
      paddingBottom: theme.spacing(1)
    }
  });

interface OwnProps {
  dummyUser: DummyUser;
  onSubmit: (dummyUser: DummyUser) => void;
  buttonText?: string;
}

interface DispatchProps {
  addError: (error: any) => void;
}

interface StateProps {}

type Props = StateProps & OwnProps & DispatchProps & WithStyles<typeof styles>;

interface ComponentState {
  dummyUser: DummyUser;
  error: string;
}

class DummyUserFormComponent extends React.Component<Props, ComponentState> {
  public static defaultProps = {
    buttonText: 'Accept'
  };

  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      dummyUser: props.dummyUser,
      error: ''
    };

    this.isDenied = this.isDenied.bind(this);
  }

  private static prevPropsDummyUser: DummyUser;
  static getDerivedStateFromProps(nextProps: Props, prevState: ComponentState) {
    let nextPropsDummyUser = nextProps.dummyUser;
    if (
      !DummyUser.CompareObjects(
        nextPropsDummyUser,
        DummyUserFormComponent.prevPropsDummyUser
      )
    ) {
      DummyUserFormComponent.prevPropsDummyUser = lodash.cloneDeep(
        nextPropsDummyUser
      );
      return {
        dummyUser: lodash.cloneDeep(nextPropsDummyUser)
      };
    }

    return null;
  }

  handleNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      dummyUser: Helper.clone(this.state.dummyUser, { name: e.target.value })
    });
  };

  handleGenderChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    this.setState({
      dummyUser: Helper.clone(this.state.dummyUser, {
        gender: e.target.value as number
      })
    });
  };

  handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!this.isDenied()) {
      this.props.onSubmit(this.state.dummyUser);
    }
  };

  isDenied(): boolean {
    const { name, gender } = this.state.dummyUser;
    let e: string = '';

    if (name.length === 0) e = 'Incorrect name';
    if (gender < 0) e = 'Incorrect gender';

    if (e) console.log(e);

    return e !== '';
  }

  render() {
    const classes = this.props.classes;
    const { name, gender } = this.state.dummyUser;

    return (
      <form className={classes.form} onSubmit={this.handleFormSubmit}>
        <FormControl className={classes.formControl}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            variant="outlined"
            value={name}
            onChange={this.handleNameChange}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            style={{ textAlign: 'left' }}
            select
            label="Gender"
            id="gender-select"
            value={gender}
            fullWidth
            onChange={this.handleGenderChange}
          >
            <MenuItem value={0}>Man</MenuItem>
            <MenuItem value={1}>Woman</MenuItem>
          </TextField>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={this.isDenied()}
        >
          {this.props.buttonText}
        </Button>
      </form>
    );
  }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {};
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    addError: async (error: any) => {
      await dispatch(addError(error));
    }
  };
};

export const DummyUserForm = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  RootState
>(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
  withStyles(styles)(DummyUserFormComponent)
);
