import React from 'react';
import { Box, Avatar, Typography, makeStyles } from '@material-ui/core';

import { User } from '../../../api/classes/user.class';

import PersonIcon from '@material-ui/icons/Person';

const useStyles = makeStyles(theme => ({
  box: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 'fit-content'
  },
  avatar: {
    width: 30,
    height: 30,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

interface OwnProps {
  user: User;
}

interface DispatchProps {}

interface StateProps {}

type Props = StateProps & OwnProps & DispatchProps;

const UserItemComponent: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  const { user } = props;

  return (
    <Box className={classes.box} textAlign="center">
      <Avatar
        className={classes.avatar}
        src={`https://api.adorable.io/avatars/30/${user.email}.png`}
      >
        <PersonIcon />
      </Avatar>
      <Typography>{user.name}</Typography>
    </Box>
  );
};

export const UserItem = UserItemComponent;
