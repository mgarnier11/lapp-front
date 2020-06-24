import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  DialogProps,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
  Dialog,
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';

import {
  DangerButton,
  DangerIconButton,
} from '../utils/dangerButton.component';
import { Helper } from '../../../helper';
import { QuestionType } from '../../../api/classes/questionType.class';
import { QuestionTemplate } from '../../../api/classes/questionTemplate.class';
import { QuestionTemplatesState } from '../../../store/questionTemplates/types';
import { RootState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    padding: '8px 16px',
    paddingTop: 12,
  },
  content: {
    padding: '0px 16px',
  },
  actions: {
    padding: '8px 16px',
  },
}));

interface OwnProps {
  dialogProps?: DialogProps;
  questionType: QuestionType;
  editable: boolean;
  disabled?: boolean;
  acceptButtonText?: string;
  deleteButtonText?: string;
  onAccept?: (questionType: QuestionType) => void;
  onDelete?: (questionTypeId: string) => void;
  title?: string;
}

interface DispatchProps {}

interface StateProps {
  questionTemplatesState: QuestionTemplatesState;
}

type Props = StateProps & OwnProps & DispatchProps;

const QuestionTypeDialogComponent: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const { questionTemplates } = props.questionTemplatesState;

  const [name, setName] = useState(props.questionType.name);
  const [description, setDescription] = useState(
    props.questionType.description
  );
  const [template, setTemplate] = useState(props.questionType.template);
  const [icon, setIcon] = useState(props.questionType.icon);
  const [allowParameters, setAllowParameters] = useState(
    props.questionType.allowParameters
  );

  useEffect(() => {
    setName(props.questionType.name || '');
    setDescription(props.questionType.description || '');
    setTemplate(props.questionType.template || questionTemplates![0]);
    setIcon(props.questionType.icon || '');
    setAllowParameters(
      typeof props.questionType.allowParameters === 'undefined'
        ? true
        : props.questionType.allowParameters
    );
  }, [props.questionType]); // eslint-disable-line

  const isDenied = (): boolean => {
    return (
      !questionTemplates!.find((t) =>
        QuestionTemplate.CompareObjects(t, template)
      ) ||
      name.length === 0 ||
      description.length === 0 ||
      icon.length === 0 ||
      allowParameters === undefined
    );
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    props.editable && setName(e.target.value);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    props.editable && setDescription(e.target.value);

  const handleTemplateChange = (e: React.ChangeEvent<{ value: unknown }>) =>
    props.editable &&
    setTemplate(
      questionTemplates!.find((t) => t.id === (e.target.value as string))!
    );

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    props.editable && setIcon(e.target.value);

  const handleAllowParametersChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: boolean
  ) => props.editable && setAllowParameters(value);

  const beforeDelete = () => {
    if (props.onDelete) props.onDelete(props.questionType.id);
  };

  const beforeAccept = () => {
    if (!isDenied() && props.onAccept) {
      props.onAccept(
        Helper.clone(props.questionType, {
          name,
          description,
          template,
          icon,
          allowParameters,
        })
      );
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
        name="templateSelect"
        margin="normal"
        variant="outlined"
        select={props.editable}
        disabled={props.disabled}
        fullWidth
        id="templateSelect"
        label="Type Template"
        value={props.editable ? template.id : template.name}
        onChange={handleTemplateChange}
      >
        {questionTemplates ? (
          questionTemplates.map((t) => (
            <MenuItem value={t.id} key={t.id}>
              {t.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>Loading...</MenuItem>
        )}
      </TextField>

      <TextField
        name="description"
        margin="normal"
        variant="outlined"
        type="text"
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

      <FormControlLabel
        control={
          <Checkbox
            checked={allowParameters}
            onChange={handleAllowParametersChange}
            name="allowParameters"
          />
        }
        label="Allow question parameters"
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

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return { questionTemplatesState: states.questionTemplatesState };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {};
};

export const QuestionTypeDialog = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  RootState
>(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
  QuestionTypeDialogComponent
);
