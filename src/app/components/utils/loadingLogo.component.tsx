import React from 'react';
import { makeStyles, CircularProgress } from '@material-ui/core';
import { BaseAvatar } from './avatars.component';
import { ThemeController } from '../../theme/themeManager';

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

  const logoToUse = ThemeController.isDark()
    ? 'logo_party_drink_2_dark_mode.png'
    : 'logo_party_drink_2.png';

  return (
    <div
      className={classes.root}
      style={{ height: props.fullHeight ? '100%' : 'auto' }}
    >
      <BaseAvatar src={`/assets/${logoToUse}`} pixelSize={210} />
      <CircularProgress size={220} thickness={1} />
    </div>
  );
};
