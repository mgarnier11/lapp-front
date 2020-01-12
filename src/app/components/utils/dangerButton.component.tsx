import React from 'react';
import { makeStyles, Button, ButtonProps, colors } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  dangerButton: {
    backgroundColor: `${theme.palette.error.main} !important`,
    color: colors.common.white,
    '&:hover': {
      backgroundColor: `${theme.palette.error.dark} !important`
    }
  }
}));

export const DangerButton: React.FunctionComponent<ButtonProps> = props => {
  const classes = useStyles();

  return <Button {...props} className={classes.dangerButton} />;
};
