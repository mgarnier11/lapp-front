import React from 'react';
import { makeStyles, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    zIndex: 11,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

interface Props {
  loading: boolean;
}

export const LoadingOverlay: React.FunctionComponent<Props> = (
  props: Props
) => {
  const classes = useStyles();

  return (
    <div
      className={classes.root}
      style={{ display: props.loading ? 'flex' : 'none' }}
    >
      <CircularProgress />
    </div>
  );
};
