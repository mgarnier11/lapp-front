import React, { useState } from 'react';
import {
  Button,
  TextField,
  Grid,
  DialogProps,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
  Container,
  Dialog,
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';

import {
  DangerButton,
  DangerIconButton
} from '../utils/dangerButton.component';
import { Helper } from '../../../helper';
import { Role } from '../../../api/classes/role.class';

const useStyles = makeStyles(theme => ({
  root: {},
  title: {
    padding: '8px 16px',
    paddingTop: 12
  },
  content: {
    padding: '0px 16px'
  },
  actions: {
    padding: '8px 16px'
  }
}));

interface OwnProps {
  dialogProps?: DialogProps;
  role: Role;
  editable: boolean;
  disabled?: boolean;
  acceptButtonText?: string;
  deleteButtonText?: string;
  onAccept?: (role: Role) => void;
  onDelete?: (roleId: string) => void;
  title?: string;
}

type Props = OwnProps;

const RoleDialogComponent: React.FunctionComponent<Props> = props => {
  const classes = useStyles();

  const [name, setName] = useState(props.role.name);
  const [icon, setIcon] = useState(props.role.icon);
  const [permissionLevel, setPermissionLevel] = useState(
    props.role.permissionLevel
  );

  React.useEffect(() => {
    setName(props.role.name || '');
    setIcon(props.role.icon || '');
    setPermissionLevel(props.role.permissionLevel || 0);
  }, [props.role]);

  const isDenied = (): boolean => {
    return name.length === 0 || icon.length === 0 || permissionLevel < 0;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    props.editable && setName(e.target.value);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    props.editable && setIcon(e.target.value);

  const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    props.editable && setPermissionLevel(parseInt(e.target.value));

  const beforeDelete = () => {
    if (props.onDelete) props.onDelete(props.role.id);
  };

  const beforeAccept = () => {
    if (!isDenied() && props.onAccept) {
      props.onAccept(Helper.clone(props.role, { name, icon, permissionLevel }));
    }
  };

  const renderForm = () => (
    <Box>
      <TextField
        name="name"
        margin="normal"
        variant="outlined"
        type="text"
        disabled={props.disabled}
        fullWidth
        id="name"
        label="Name"
        value={name}
        onChange={handleNameChange}
      />
      <TextField
        name="icon"
        margin="normal"
        variant="outlined"
        type="text"
        disabled={props.disabled}
        fullWidth
        id="icon"
        label="Icon"
        value={icon}
        onChange={handleIconChange}
      />

      <TextField
        name="permissionLevel"
        margin="normal"
        variant="outlined"
        type="number"
        disabled={props.disabled}
        fullWidth
        id="permissionLevel"
        label="PermissionLevel"
        value={permissionLevel}
        onChange={handlePermissionChange}
      />
    </Box>
  );

  const renderAcceptButton = () => {
    if (props.acceptButtonText) {
      return (
        <Button
          disabled={props.disabled || isDenied()}
          variant="contained"
          color="primary"
          onClick={beforeAccept}
        >
          {props.acceptButtonText}
        </Button>
      );
    } else {
      return (
        <IconButton
          disabled={props.disabled || isDenied()}
          onClick={beforeAccept}
        >
          <CheckIcon />
        </IconButton>
      );
    }
  };

  const renderDeleteButton = () => {
    if (props.deleteButtonText) {
      return (
        <DangerButton
          variant="contained"
          disabled={props.disabled}
          onClick={beforeDelete}
        >
          {props.deleteButtonText}
        </DangerButton>
      );
    } else {
      return (
        <DangerIconButton disabled={props.disabled} onClick={beforeDelete}>
          <DeleteIcon />
        </DangerIconButton>
      );
    }
  };
  const renderDialog = () => (
    <Dialog
      {...(props.dialogProps || { open: false })}
      className={classes.root}
      fullWidth
      maxWidth="sm"
    >
      {props.title && (
        <DialogTitle disableTypography className={classes.title}>
          <Typography component="h3" variant="h5" align="center">
            {props.title}
          </Typography>
        </DialogTitle>
      )}
      <DialogContent className={classes.content}>{renderForm()}</DialogContent>
      {(props.onDelete || props.onAccept) && (
        <DialogActions className={classes.actions}>
          {props.onDelete && renderDeleteButton()}
          {props.onAccept && renderAcceptButton()}
        </DialogActions>
      )}
    </Dialog>
  );

  const renderCard = () => (
    <Card className={classes.root}>
      {props.title && (
        <CardHeader title={props.title} className={classes.title} />
      )}
      <CardContent className={classes.content}>{renderForm()}</CardContent>
      {(props.onDelete || props.onAccept) && (
        <CardActions className={classes.actions}>
          {props.onDelete && renderDeleteButton()}
          {props.onAccept && renderAcceptButton()}
        </CardActions>
      )}
    </Card>
  );

  return props.dialogProps ? renderDialog() : renderCard();
};

export const RoleDialog = RoleDialogComponent;
