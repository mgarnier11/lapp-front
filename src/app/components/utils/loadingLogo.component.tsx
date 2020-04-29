import React from 'react';
import { makeStyles, CircularProgress } from '@material-ui/core';
import { BaseAvatar } from './avatars.component';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      position: 'absolute',
    },
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
    position: 'relative',
  },
}));

interface Props {
  fullHeight?: boolean;
}

export const LoadingLogo: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  return (
    <div
      className={classes.root}
      style={{ height: props.fullHeight ? '100%' : 'auto' }}
    >
      <BaseAvatar src="assets/logo_party_drink_2.png" pixelSize={210} />
      <CircularProgress size={220} thickness={1} />
    </div>
  );
};
