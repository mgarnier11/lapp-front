import React from 'react';
import { makeStyles, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
  },
}));

interface Props {
  fullHeight?: boolean;
}

export const Loading: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  return (
    <div
      className={classes.root}
      style={{ height: props.fullHeight ? '100%' : 'auto' }}
    >
      <CircularProgress />
    </div>
  );
};
