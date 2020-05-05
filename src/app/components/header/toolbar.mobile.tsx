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
  Divider,
  ListItem,
  Avatar,
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
import Brightness3Icon from '@material-ui/icons/Brightness3';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import FilterNoneIcon from '@material-ui/icons/FilterNone';

import { User } from '../../../api/classes/user.class';
import { ListItemLink } from '../utils/linkButtons.components';
import { headerHeight } from './header.component';
import { Role } from '../../../api/classes/role.class';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { ThemeController } from '../../theme/themeManager';
import { UserItem } from '../user/user.item.component';
import { BaseAvatar } from '../utils/avatars.component';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appName: {
    flexGrow: 1,
  },
  toolBar: {
    height: headerHeight,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    paddingTop: headerHeight,
  },
  drawerWrapper: {
    justifyContent: 'space-between',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontSize: '150%',
    marginBottom: theme.spacing(1),
  },
}));

interface OwnProps {
  user?: User;
  logout: (hideSuccess?: boolean) => Promise<any>;
}

type Props = OwnProps & RouteComponentProps;

const ToolbarMobileComponent: React.FunctionComponent<Props> = (
  props: Props
) => {
  const classes = useStyles();
  const { user } = props;
  const [drawerOpen, setState] = React.useState(false);

  const toggleDrawer = (open: boolean) => {
    setState(open);
  };

  const baseItems = () => <>{listItem('/home', 'Home', <HomeIcon />)}</>;

  const baseUserItems = () => (
    <>{listItem('/questions', 'Questions', <RateReviewIcon />)}</>
  );

  const adminItems = () => (
    <>
      {listItem('/roles', 'Roles', <PeopleIcon />)}
      {listItem('/questionTypes', 'Question Types', <ForumIcon />)}
      {listItem('/questionTemplates', 'Question Templates', <FilterNoneIcon />)}
    </>
  );

  const userItems = (user: User) => (
    <>
      <UserItem user={user} />
      <ListItem button onClick={ThemeController.toggleTheme}>
        {ThemeController.isLight() ? (
          <>
            <ListItemIcon children={<Brightness3Icon />} />
            <ListItemText primary="Set dark mode" />
          </>
        ) : (
          <>
            <ListItemIcon children={<WbSunnyIcon />} />
            <ListItemText primary="Set clear mode" />
          </>
        )}
      </ListItem>
      {listItem('/me', 'Settings', <SettingsIcon />)}
      <ListItemLink
        to="/signin"
        onClick={() => {
          props.logout(true).then(() => window.location.reload());
        }}
      >
        <ListItemIcon>
          <PowerSettingsNewIcon />
        </ListItemIcon>
        <ListItemText primary={'Disconnect'} />
      </ListItemLink>
    </>
  );

  const notLoggedItems = () => (
    <>
      {listItem('/login', 'Login', <ExitToAppIcon />)}
      {listItem('/register', 'Register', <PersonAddIcon />)}
    </>
  );

  const listItem = (to: string, text: string, icon: JSX.Element) => (
    <ListItemLink to={to} onClick={() => toggleDrawer(false)}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItemLink>
  );

  const logoToUse = ThemeController.isDark()
    ? 'logo_party_drink_dark_mode.png'
    : 'logo_party_drink.png';

  return (
    <>
      <Toolbar className={classes.toolBar}>
        <IconButton edge="start" onClick={() => toggleDrawer(!drawerOpen)}>
          {drawerOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>

        <Typography
          component="h1"
          variant="h5"
          align="center"
          className={classes.appName}
        >
          <Link to="/home">Party Drink</Link>
        </Typography>
        <IconButton edge="end" onClick={() => props.history.goBack()}>
          <ArrowBackIcon />
        </IconButton>
      </Toolbar>
      <SwipeableDrawer
        className={classes.drawer}
        style={{ zIndex: 1200 }}
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
        classes={{ paper: classes.drawerPaper }}
      >
        <BaseAvatar
          src={`/assets/${logoToUse}`}
          style={{ marginTop: '20px' }}
        ></BaseAvatar>
        <List style={{ height: '100%' }} className={classes.drawerWrapper}>
          {user ? (
            <>
              <div>
                {baseItems()}
                {!user.isIDVice() && baseUserItems()}
                {user.role.permissionLevel >= Role.AdminPermissionLevel &&
                  adminItems()}
                {/* <Divider /> */}
              </div>
              <div>
                <Divider />
                {userItems(user!)}
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

export const ToolbarMobile = withRouter(ToolbarMobileComponent);
