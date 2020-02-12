import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center'
  },
  userImg: {
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    borderRadius: '50%',
    height: 0,
    margin: 'auto'
  }
}));

type MyAvatarProps = {
  src: string;
  percentSize?: number;
  pixelSize?: number;
};

export const MyAvatar: React.FunctionComponent<MyAvatarProps> = (
  props: MyAvatarProps
) => {
  const classes = useStyles();

  let size = '50%';

  if (props.percentSize) size = `${props.percentSize}%`;
  else if (props.pixelSize) size = `${props.pixelSize}px`;

  return (
    <div
      className={classes.userImg}
      style={{
        backgroundImage: `url("${props.src}")`,
        width: size,
        paddingBottom: size
      }}
    />
  );
};
