import React from 'react';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { Role } from '../../../api/classes/role.class';
import { Grid, useMediaQuery, Box } from '@material-ui/core';

import { RoleItem } from './role.item.component';
import { Helper } from '../../../helper';

const useStyles = makeStyles(theme => ({
  rolesGrid: {
    paddingTop: theme.spacing(1)
  },
  roleCol: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    height: 'fit-content'
  },
  roleItem: {
    padding: theme.spacing(1)
  }
}));

interface OwnProps {
  roles: Role[];
  onDelete?: (roleId: string) => void;
  onUpdate?: (role: Role) => void;
}

type Props = OwnProps;

const RoleListComponent: React.FunctionComponent<Props> = props => {
  const classes = useStyles();
  const theme = useTheme();
  //const isXs = useMediaQuery(theme.breakpoints.up('xs'));
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  const { roles } = props;

  const roleCols = Helper.explodeArray(roles, isLg ? 3 : isSm ? 2 : 1);

  return (
    <Box>
      <Grid className={classes.rolesGrid} container>
        {roleCols.map((roleList, index) => (
          <Grid
            key={index}
            item
            container
            xs={12}
            sm={6}
            lg={4}
            className={classes.roleCol}
          >
            {roleList.map(role => (
              <Grid key={role.id} item xs={12} className={classes.roleItem}>
                <RoleItem
                  role={role}
                  onDelete={props.onDelete}
                  onUpdate={props.onUpdate}
                />
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export const RoleList = RoleListComponent;
