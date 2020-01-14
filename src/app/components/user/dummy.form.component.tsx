import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { MenuItem, Button, TextField, FormControl } from '@material-ui/core';
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
  onSubmit: (dummyUser: DummyUser) => void;
  buttonText?: string;
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
    setName(e.target.value);

  const handleGenderChange = (e: React.ChangeEvent<{ value: unknown }>) =>
    setGender(e.target.value as number);

  const beforeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isDenied()) {
      props.onSubmit(DummyUser.New({ gender, name }));
    }
  };

  return (
    <form className={classes.form} onSubmit={beforeSubmit}>
      <FormControl className={classes.formControl}>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          variant="outlined"
          value={name}
          onChange={handleNameChange}
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
          onChange={handleGenderChange}
        >
          <MenuItem value={0}>Man</MenuItem>
          <MenuItem value={1}>Woman</MenuItem>
        </TextField>
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isDenied()}
      >
        {props.buttonText}
      </Button>
    </form>
  );
};

DummyUserFormComponent.defaultProps = {
  buttonText: 'Accept'
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
