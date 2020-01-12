import React from 'react';
import { makeStyles, BoxProps, Box } from '@material-ui/core';
import { palette } from '../../theme/palette';

const useStyles = makeStyles(theme => ({
  formControlBox: {
    border: `1px solid ${palette.secondary.main}`,
    borderRadius: 4
  }
}));

export const FormControlBox: React.FunctionComponent<BoxProps> = props => {
  const classes = useStyles();

  return <Box {...props} className={classes.formControlBox} />;
};
