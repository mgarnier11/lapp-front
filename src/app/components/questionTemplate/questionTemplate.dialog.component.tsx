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
  Typography,
  MenuItem
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';

import {
  DangerButton,
  DangerIconButton
} from '../utils/dangerButton.component';
import { Helper } from '../../../helper';
import { QuestionTemplate } from '../../../api/classes/questionTemplate.class';
import QuestionTemplateLoader, {
  templateList
} from '../../templates/questions';

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
  questionTemplate: QuestionTemplate;
  editable: boolean;
  disabled?: boolean;
  showPreview?: boolean;
  acceptButtonText?: string;
  deleteButtonText?: string;
  onAccept?: (questionTemplate: QuestionTemplate) => void;
  onDelete?: (questionTemplateId: string) => void;
  title?: string;
}

type Props = OwnProps;

const QuestionTemplateDialogComponent: React.FunctionComponent<Props> = props => {
  const classes = useStyles();

  const [name, setName] = useState(props.questionTemplate.name);
  const [clientPath, setClientPath] = useState(
    props.questionTemplate.clientPath
  );

  React.useEffect(() => {
    setName(props.questionTemplate.name || '');
    setClientPath(props.questionTemplate.clientPath || '');
  }, [props.questionTemplate]);

  const isDenied = (): boolean => {
    return name.length === 0 || clientPath.length === 0;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    props.editable && setName(e.target.value);

  const handleClientPathChange = (e: React.ChangeEvent<{ value: unknown }>) =>
    props.editable && setClientPath(e.target.value as string);

  const beforeDelete = () => {
    if (props.onDelete) props.onDelete(props.questionTemplate.id);
  };

  const beforeAccept = () => {
    if (!isDenied() && props.onAccept) {
      props.onAccept(
        Helper.clone(props.questionTemplate, { name, clientPath })
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
      {props.showPreview && (
        <TextField
          name="clientPathSelect"
          margin="normal"
          variant="outlined"
          select={props.editable}
          disabled={props.disabled}
          fullWidth
          id="clientPathSelect"
          label="Template client Path"
          value={clientPath}
          onChange={handleClientPathChange}
        >
          {templateList ? (
            templateList.map(t => (
              <MenuItem value={t} key={t}>
                {t}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Loading...</MenuItem>
          )}
        </TextField>
      )}
      <QuestionTemplateLoader templatePath={clientPath} templateProps={{}} />
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

QuestionTemplateDialogComponent.defaultProps = {
  showPreview: true
};

export const QuestionTemplateDialog = QuestionTemplateDialogComponent;
