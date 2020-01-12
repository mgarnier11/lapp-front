import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import {
  IconButton,
  Typography,
  SwipeableDrawer,
  makeStyles,
  List,
  ListItemIcon,
  ListItemText,
  Divider
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import RateReviewIcon from '@material-ui/icons/RateReview';
import PeopleIcon from '@material-ui/icons/People';
import ForumIcon from '@material-ui/icons/Forum';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import SettingsIcon from '@material-ui/icons/Settings';

import { User } from '../../../api/classes/user.class';
import { ListItemLink } from '../utils/linkButtons.components';
import { headerHeight } from './header.component';
import { Role } from '../../../api/classes/role.class';
import { Link } from 'react-router-dom';
import { ThemeController } from '../../theme/themeManager';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  appName: {
    flexGrow: 1
  },
  toolBar: {
    height: headerHeight
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    paddingTop: headerHeight
  },
  drawerWrapper: {
    justifyContent: 'space-between',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
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

  const baseItems = () => <>{ListItem('/home', 'Home', <HomeIcon />)}</>;

  const baseUserItems = () => (
    <>{ListItem('/questions', 'Questions', <RateReviewIcon />)}</>
  );

  const adminItems = () => (
    <>
      {ListItem('/roles', 'Roles', <PeopleIcon />)}
      {ListItem('/questionTypes', 'Question Types', <ForumIcon />)}
    </>
  );

  const userItems = () => (
    <>
      <Typography component="h6" align="center" style={{ fontSize: '150%' }}>
        {user!.name}
      </Typography>
      {ListItem('/me', 'Settings', <SettingsIcon />)}
      {ListItem('/login', 'Disconnect', <PowerSettingsNewIcon />)}
    </>
  );

  const notLoggedItems = () => (
    <>
      {ListItem('/login', 'Login', <ExitToAppIcon />)}
      {ListItem('/register', 'Register', <PersonAddIcon />)}
    </>
  );

  const ListItem = (to: string, text: string, icon: JSX.Element) => (
    <ListItemLink to={to} onClick={() => toggleDrawer(false)}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItemLink>
  );

  return (
    <>
      <Toolbar className={classes.toolBar}>
        <IconButton edge="start" onClick={() => toggleDrawer(!drawerOpen)}>
          {drawerOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>

        <Typography
          component="h1"
          variant="h6"
          align="center"
          className={classes.appName}
        >
          <Link to="/home">App Name</Link>
        </Typography>
        <IconButton edge="end" onClick={() => ThemeController.toggleTheme()}>
          <ArrowBackIcon />
        </IconButton>
      </Toolbar>
      <SwipeableDrawer
        className={classes.drawer}
        style={{ zIndex: 1000 }}
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
        classes={{ paper: classes.drawerPaper }}
      >
        <List style={{ height: '100%' }} className={classes.drawerWrapper}>
          {user ? (
            <>
              <div>
                {baseItems()}
                {!user.isIDVice() && baseUserItems()}
                {user.role.permissionLevel >= Role.AdminPermissionLevel &&
                  adminItems()}
                <Divider />
              </div>
              <div>
                <Divider />
                {!user.isIDVice() && userItems()}
              </div>
            </>
          ) : (
            <div>{notLoggedItems()}</div>
          )}
        </List>
      </SwipeableDrawer>
    </>
  );
};

export const ToolbarMobile = ToolbarMobileComponent;
