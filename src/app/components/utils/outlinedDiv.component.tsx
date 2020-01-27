import React from 'react';

import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core';

const InputComponent: React.FunctionComponent<any> = (props: any) => {
  const { inputRef, ...other } = props;

  return <div key={'patate'} {...other} />;
};

interface OutlinedDivProps {
  children: React.ReactNode;
  label: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiOutlinedInput-root': {
      padding: 0
    }
  }
}));

export const OutlinedDiv: React.FunctionComponent<OutlinedDivProps> = (
  props: OutlinedDivProps
) => {
  const classes = useStyles();
  return (
    <TextField
      margin="normal"
      className={classes.root}
      variant="outlined"
      label={props.label}
      disabled={props.disabled}
      fullWidth={props.fullWidth}
      multiline
      InputLabelProps={{ shrink: true }}
      InputProps={{
        inputComponent: InputComponent
      }}
      inputProps={{ children: props.children }}
    />
  );
};
