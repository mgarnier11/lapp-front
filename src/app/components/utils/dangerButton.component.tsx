import React from 'react';
import {
  makeStyles,
  Button,
  ButtonProps,
  colors,
  IconButton,
  IconButtonProps
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  dangerButton: {
    backgroundColor: `${theme.palette.error.main} !important`,
    color: colors.common.white,
    '&:hover': {
      backgroundColor: `${theme.palette.error.dark} !important`
    },
    '@media (hover: none)': {
      backgroundColor: `${theme.palette.error.main} !important`
    }
  },
  dangerIconButton: {
    color: theme.palette.error.main,
    '&:hover': {
      color: theme.palette.error.dark,
      backgroundColor: 'rgba(211, 47, 47, 0.1)'
    },
    '@media (hover: none)': {
      color: `${theme.palette.error.main} !important`,
      backgroundColor: 'transparent !important'
    }
  }
}));

export const DangerButton: React.FunctionComponent<ButtonProps> = props => {
  const classes = useStyles();

  return <Button {...props} className={classes.dangerButton} />;
};

export const DangerIconButton: React.FunctionComponent<IconButtonProps> = props => {
  const classes = useStyles();

  return <IconButton {...props} className={classes.dangerIconButton} />;
};
