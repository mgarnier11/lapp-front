import React from 'react';
import { makeStyles } from '@material-ui/core';
import { User } from '../../../api/classes/user.class';
import { QuestionType } from '../../../api/classes/questionType.class';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
  },
  img: {
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    borderRadius: '50%',
    height: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

type BaseAvatarProps = {
  src: string;
  percentSize?: number;
  pixelSize?: number;
  style?: React.CSSProperties;
};

export const BaseAvatar: React.FunctionComponent<BaseAvatarProps> = (
  props: BaseAvatarProps
) => {
  const classes = useStyles();

  let size = '50%';

  if (props.percentSize) size = `${props.percentSize}%`;
  else if (props.pixelSize) size = `${props.pixelSize}px`;

  return (
    <div
      className={classes.img}
      style={{
        ...props.style,
        backgroundImage: `url("${props.src}")`,
        width: size,
        paddingBottom: size,
      }}
    />
  );
};

type TypeAvatarProps = BaseAvatarProps & {
  type: QuestionType;
};

export const TypeAvatar: React.FunctionComponent<TypeAvatarProps> = (
  props: TypeAvatarProps
) => {
  const classes = useStyles();

  let size = '50%';

  if (props.percentSize) size = `${props.percentSize}%`;
  else if (props.pixelSize) size = `${props.pixelSize}px`;

  return (
    <div
      className={classes.img}
      style={{
        backgroundImage: `url("${props.type.icon || props.src}")`,
        width: size,
        paddingBottom: size,
      }}
    />
  );
};
