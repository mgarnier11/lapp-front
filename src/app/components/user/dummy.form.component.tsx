import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  MenuItem,
  Button,
  TextField,
  FormControl,
  Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { RootState } from '../../../store';
import { DummyUser } from '../../../api/classes/dummyUser.class';

// TODO add editable prop
// TODO add disabled prop
// TODO add delet button

const useStyles = makeStyles(theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center'
  },
  formControl: {
    paddingBottom: theme.spacing(1)
  }
}));

interface OwnProps {
  dummyUser: DummyUser;
  editable: boolean;
  disabled?: boolean;
  acceptButtonText?: string;
  onSubmit?: (dummyUser: DummyUser) => void;
}

interface DispatchProps {}

interface StateProps {}

type Props = StateProps & OwnProps & DispatchProps;

const DummyUserFormComponent: React.FunctionComponent<Props> = props => {
  const classes = useStyles();

  const [name, setName] = useState('');
  const [gender, setGender] = useState(0);

  const isDenied = (): boolean => {
    let e: string = '';

    if (name.length === 0) e = 'Incorrect name';
    if (gender < 0) e = 'Incorrect gender';

    if (e) console.log(e);

    return e !== '';
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    props.editable && setName(e.target.value);

  const handleGenderChange = (e: React.ChangeEvent<{ value: unknown }>) =>
    props.editable && setGender(e.target.value as number);

  const beforeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isDenied() && props.onSubmit) {
      props.onSubmit(DummyUser.New({ gender, name }));
    }
  };

  return (
    <form noValidate onSubmit={beforeSubmit}>
      <TextField
        name="name"
        margin="normal"
        variant="outlined"
        type="text"
        required
        disabled={props.disabled}
        fullWidth
        id="name"
        label="Name"
        value={name}
        onChange={handleNameChange}
      />
      <TextField
        name="genderSelect"
        margin="normal"
        variant="outlined"
        select
        required
        disabled={props.disabled}
        fullWidth
        id="genderSelect"
        label="Gender"
        value={gender}
        onChange={handleGenderChange}
      >
        <MenuItem value={0}>Man</MenuItem>
        <MenuItem value={1}>Woman</MenuItem>
      </TextField>
      {props.onSubmit && (
        <Grid container spacing={2}>
          {props.onSubmit && (
            <Grid item xs>
              <Button
                type="submit"
                fullWidth
                disabled={props.disabled || isDenied()}
                variant="contained"
                color="primary"
              >
                {props.acceptButtonText}
              </Button>
            </Grid>
          )}
        </Grid>
      )}
    </form>
  );
};

DummyUserFormComponent.defaultProps = {
  acceptButtonText: 'Accept'
};

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {};
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {};
};

export const DummyUserForm = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  RootState
>(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
  DummyUserFormComponent
);
