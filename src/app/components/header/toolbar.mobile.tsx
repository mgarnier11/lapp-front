import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import {
  IconButton,
  Typography,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import HouseIcon from '@material-ui/icons/House';
import { Link } from 'react-router-dom';

import { User } from '../../../api/classes/user.class';
import { renderUser } from './header.component';

interface OwnProps {
  user: User;
  classes: any;
  logout: any;
}

type Props = OwnProps;

const ToolbarMobileComponent: React.FunctionComponent<Props> = (
  props: Props
) => {
  const { user, classes } = props;
  const [state, setState] = React.useState({
    drawerOpen: false
  });

  const admin = () =>
    user.role.permissionLevel >= 100 ? (
      <>
        <Link to="/roles" onClick={() => toggleDrawer(false)}>
          <ListItem button className={classes.listItem}>
            <ListItemText>Roles</ListItemText>
          </ListItem>
        </Link>
        <Link to="/questionTypes" onClick={() => toggleDrawer(false)}>
          <ListItem button className={classes.listItem}>
            <ListItemText>Question Types</ListItemText>
          </ListItem>
        </Link>
      </>
    ) : (
      <></>
    );

  const toggleDrawer = (open: boolean) => {
    setState({ drawerOpen: open });
  };

  return (
    <Toolbar>
      <IconButton
        edge="start"
        className={classes.button}
        color="inherit"
        onClick={() => toggleDrawer(!state.drawerOpen)}
        style={{ zIndex: 1200 }}
      >
        {state.drawerOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      <IconButton
        edge="start"
        className={classes.button}
        color="inherit"
        style={{ zIndex: 1200 }}
      >
        <Link to="/home" className={classes.button}>
          <HouseIcon />
        </Link>
      </IconButton>

      <Typography style={{ flexGrow: 1 }} />

      {renderUser(props)}

      <SwipeableDrawer
        swipeAreaWidth={56}
        className={classes.drawer}
        anchor="top"
        open={state.drawerOpen}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.toolbar} />
        <Typography
          variant="h6"
          className={classes.title}
          align="center"
          style={{ paddingTop: '5px' }}
        >
          <Link to="/home" className={classes.button}>
            Name not defined
          </Link>
        </Typography>
        <List component="nav">
          <Link to="/questions" onClick={() => toggleDrawer(false)}>
            <ListItem button className={classes.listItem}>
              <ListItemText>Questions</ListItemText>
            </ListItem>
          </Link>
          {admin()}
        </List>
      </SwipeableDrawer>
    </Toolbar>
  );
};

export const ToolbarMobile = ToolbarMobileComponent;
