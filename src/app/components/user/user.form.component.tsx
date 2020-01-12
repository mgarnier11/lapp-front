import React, { FunctionComponent, useState } from 'react'; // importing FunctionComponent
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { User } from '../../../api/classes/user.class';
import { UserState } from '../../../store/user/types';
import { RootState } from '../../../store';
import {
  TextField,
  Grid,
  Button,
  Typography,
  MenuItem,
  Box,
  FormControl,
  Switch,
  FormControlLabel
} from '@material-ui/core';
import { DangerButton } from '../utils/dangerButton.component';
import { FormControlBox } from '../utils/formControlBox.component';

interface OwnProps {
  user: User;
  editable: boolean;
  disabled?: boolean;
  acceptButtonText?: string;
  deleteButtonText?: string;
  displayRole?: boolean;
  displayConfirms?: boolean;
  displaySettings?: boolean;
  displayDelete?: boolean;
  onSubmit?: () => void;
  onDelete?: () => void;
}

interface DispatchProps {}

interface StateProps {
  userState: UserState;
}

type UserFormProps = OwnProps & DispatchProps & StateProps;

const UserFormComponent: FunctionComponent<UserFormProps> = props => {
  const acceptButtonText = props.acceptButtonText || 'Confirm Button';
  const deleteButtonText = props.deleteButtonText || 'Delete Button';
  const [name, setName] = useState(props.user.name);
  const [email, setEmail] = useState(props.user.email);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState(props.user.gender);
  const [darkMode, setDarkMode] = useState(props.user.darkMode);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    props.editable && setName(e.target.value);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    props.editable && setEmail(e.target.value);

  const handleConfirmEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    props.editable && setConfirmEmail(e.target.value);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    props.editable && setPassword(e.target.value);

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => props.editable && setConfirmPassword(e.target.value);

  const handleGenderChange = (e: React.ChangeEvent<{ value: unknown }>) =>
    props.editable && setGender(e.target.value as number);

  const handleDarkModeChange = () => props.editable && setDarkMode(false);

  const beforeDelete = () => {};

  const beforeSubmit = () => {};

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
        name="email"
        margin="normal"
        variant="outlined"
        type="text"
        required
        disabled={props.disabled}
        fullWidth
        id="email"
        label="Email Address"
        value={email}
        onChange={handleEmailChange}
      />
      {props.displayConfirms && (
        <TextField
          name="confirmEmail"
          margin="normal"
          variant="outlined"
          type="text"
          required
          disabled={props.disabled}
          fullWidth
          id="confirmEmail"
          label="Confirm your Email Address"
          value={confirmEmail}
          onChange={handleConfirmEmailChange}
        />
      )}
      <TextField
        name="password"
        margin="normal"
        variant="outlined"
        type="password"
        required
        disabled={props.disabled}
        fullWidth
        autoComplete="new-password"
        id="password"
        label="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      {props.displayConfirms && (
        <TextField
          name="confirmPassword"
          margin="normal"
          variant="outlined"
          type="password"
          required
          disabled={props.disabled}
          fullWidth
          id="confirmPassword"
          label="Confirm your Password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
      )}
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
      {props.displayRole && (
        <TextField
          name="role"
          margin="normal"
          variant="outlined"
          disabled
          fullWidth
          id="role"
          label="Role"
          value={props.user.role.name}
        />
      )}
      {props.displaySettings && <></>}
      <Grid container spacing={2}>
        {props.displayDelete && (
          <Grid item xs>
            <DangerButton
              fullWidth
              variant="contained"
              disabled={props.disabled}
              onClick={beforeDelete}
            >
              {deleteButtonText}
            </DangerButton>
          </Grid>
        )}
        <Grid item xs>
          <Button
            type="submit"
            fullWidth
            disabled={props.disabled}
            variant="contained"
            color="primary"
          >
            {acceptButtonText}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

const mapStateToProps = (states: RootState): StateProps => {
  return {
    userState: states.userState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>
): DispatchProps => {
  return {};
};

export const UserForm = connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(UserFormComponent);
