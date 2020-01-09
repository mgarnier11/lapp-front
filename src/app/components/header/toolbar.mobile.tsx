import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import {
  IconButton,
  Typography,
  SwipeableDrawer,
  makeStyles
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import { Link } from 'react-router-dom';

import { User } from '../../../api/classes/user.class';
import { IconButtonLink } from '../utils/linkButtons.components';

const useStyles = makeStyles(theme => ({
  appName: {
    flexGrow: 1
  },
  toolBar: {
    height: '64px'
  },
  drawer: {
    width: '150px',
    flexShrink: 0
  },
  drawerPaper: {
    width: '150px',
    paddingTop: '64px'
  }
}));

interface OwnProps {
  user?: User;
}

type Props = OwnProps;

const ToolbarMobileComponent: React.FunctionComponent<Props> = (
  props: Props
) => {
  const classes = useStyles();
  const { user } = props;
  const [drawerOpen, setState] = React.useState(false);

  const toggleDrawer = (open: boolean) => {
    setState(open);
  };

  return (
    <>
      <Toolbar className={classes.toolBar}>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => toggleDrawer(!drawerOpen)}
        >
          {drawerOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          align="center"
          className={classes.appName}
        >
          App Name
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => console.log('create back button manager')}
        >
          <ArrowBackIcon />
        </IconButton>
      </Toolbar>
      <SwipeableDrawer
        className={classes.drawer}
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
        classes={{ paper: classes.drawerPaper }}
      >
        OK
      </SwipeableDrawer>
    </>
  );
};

export const ToolbarMobile = ToolbarMobileComponent;
