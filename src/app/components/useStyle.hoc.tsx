import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

export const useStyle = (Component: any, styles: any) => {
  return (props: any) => {
    const classes = makeStyles(theme => styles(theme));

    return <Component classes={classes()} {...props} />;
  };
};
