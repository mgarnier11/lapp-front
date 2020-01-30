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
  Dialog
} from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';

import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';

import {
  DangerButton,
  DangerIconButton
} from '../utils/dangerButton.component';
import { Helper } from '../../../helper';
import { QuestionType } from '../../../api/classes/questionType.class';

// const useStyles = makeStyles(theme => ({}));

interface OwnProps {
  dialog: boolean;
  questionType: QuestionType;
  editable: boolean;
  disabled?: boolean;
  acceptButtonText?: string;
  deleteButtonText?: string;
  onAccept?: (questionType: QuestionType) => void;
  onDelete?: (questionTypeId: string) => void;
  title?: string;
  dialogProps: DialogProps;
}

type Props = OwnProps;

const QuestionTypeDialogComponent: React.FunctionComponent<Props> = props => {
  // const classes = useStyles();

  const [name, setName] = useState(props.questionType.name);
  const [description, setDescription] = useState(
    props.questionType.description
  );

  console.log(props.questionType.description);

  const isDenied = (): boolean => {
    return name.length === 0 || description.length === 0;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    props.editable && setName(e.target.value);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    props.editable && setDescription(e.target.value);

  const beforeDelete = () => {
    if (props.onDelete) props.onDelete(props.questionType.id);
  };

  const beforeAccept = () => {
    if (!isDenied() && props.onAccept) {
      props.onAccept(Helper.clone(props.questionType, { name, description }));
    }
  };

  const renderDialogContent = () => (
    <DialogContent>
      <TextField
        name="text"
        margin="normal"
        variant="outlined"
        type="text"
        required
        disabled={props.disabled}
        fullWidth
        id="text"
        label="Text"
        value={name}
        onChange={handleNameChange}
      />
      <TextField
        name="description"
        margin="normal"
        variant="outlined"
        type="text"
        required
        disabled={props.disabled}
        fullWidth
        multiline
        rows={4}
        rowsMax={6}
        id="description"
        label="Description"
        value={description}
        onChange={handleDescriptionChange}
      />
    </DialogContent>
  );

  const renderDialogTitle = () => <DialogTitle>{props.title}</DialogTitle>;

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
          color="primary"
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

  const renderDialogActions = () => (
    <DialogActions>
      {props.onDelete && props.editable && renderDeleteButton()}

      {props.onAccept && props.editable && renderAcceptButton()}
    </DialogActions>
  );

  const renderDialogYes = () => (
    <Dialog {...props.dialogProps}>
      {renderDialogTitle()}
      {renderDialogContent()}
      {renderDialogActions()}
    </Dialog>
  );

  const renderDialogNo = () => (
    <Container component="div">
      {renderDialogTitle()}
      {renderDialogContent()}
      {renderDialogActions()}
    </Container>
  );

  return props.dialog ? renderDialogYes() : renderDialogNo();
};

export const QuestionTypeDialog = QuestionTypeDialogComponent;
