import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  MenuItem,
  Button,
  TextField,
  Grid,
  Box,
  Avatar,
  Typography,
  makeStyles
} from '@material-ui/core';

import { RootState } from '../../../store';
import { DummyUser } from '../../../api/classes/dummyUser.class';
import { User } from '../../../api/classes/user.class';

import PersonIcon from '@material-ui/icons/Person';

const useStyles = makeStyles(theme => ({
  box: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(3)
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
    <Box className={classes.box}>
      <Avatar className={classes.avatar}>
        <PersonIcon />
      </Avatar>
      <Typography>{user.name}</Typography>
    </Box>
  );
};

export const UserItem = UserItemComponent;
