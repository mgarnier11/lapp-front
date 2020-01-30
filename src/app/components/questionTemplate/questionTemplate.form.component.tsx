import React, { useState } from 'react';
import { Button, TextField, Grid } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';

import { DangerButton } from '../utils/dangerButton.component';
import { Helper } from '../../../helper';
import { QuestionTemplate } from '../../../api/classes/questionTemplate.class';

// const useStyles = makeStyles(theme => ({}));

interface OwnProps {
  questionTemplate: QuestionTemplate;
  editable: boolean;
  disabled?: boolean;
  acceptButtonText?: string;
  deleteButtonText?: string;
  onSubmit?: (questionTemplate: QuestionTemplate) => void;
  onDelete?: (questionTemplateId: string) => void;
}

type Props = OwnProps;

const QuestionTemplateFormComponent: React.FunctionComponent<Props> = props => {
  // const classes = useStyles();

  const [name, setName] = useState(props.questionTemplate.name);
  const [clientPath, setClientPath] = useState(
    props.questionTemplate.clientPath
  );

  const isDenied = (): boolean => {
    return name.length === 0; // || clientPath.length === 0;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    props.editable && setName(e.target.value);

  const handleClientPathChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    props.editable && setClientPath(e.target.value);

  const beforeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isDenied() && props.onSubmit) {
      props.onSubmit(
        Helper.clone(props.questionTemplate, { name, clientPath })
      );
    }
  };

  const beforeDelete = () => {
    if (props.onDelete) props.onDelete(props.questionTemplate.id);
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
      {(props.onDelete || props.onSubmit) && (
        <Grid container spacing={2}>
          {props.onDelete && props.editable && (
            <Grid item xs>
              <DangerButton
                fullWidth
                variant="contained"
                disabled={props.disabled}
                onClick={beforeDelete}
              >
                {props.deleteButtonText}
              </DangerButton>
            </Grid>
          )}
          {props.onSubmit && props.editable && (
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

QuestionTemplateFormComponent.defaultProps = {
  acceptButtonText: 'Confirm Button',
  deleteButtonText: 'Delete Button'
};

export const QuestionTemplateForm = QuestionTemplateFormComponent;
