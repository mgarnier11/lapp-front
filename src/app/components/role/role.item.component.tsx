import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  CardActions
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { Role } from '../../../api/classes/role.class';

const useStyles = makeStyles(theme => ({
  cardContent: {
    paddingTop: '0 !important'
  }
}));

interface OwnProps {
  role: Role;
  onDelete?: (roleId: string) => void;
  onUpdate?: (role: Role) => void;
}

type Props = OwnProps;

const RoleItemComponent: React.FunctionComponent<Props> = props => {
  const classes = useStyles();

  const { role } = props;

  const handleEdit = () => props.onUpdate && props.onUpdate(role);

  const handleDelete = () => props.onDelete && props.onDelete(role.id);

  return (
    <Card>
      <CardHeader title={role.name} />
      <CardContent className={classes.cardContent}>
        {role.permissionLevel}
      </CardContent>
      {(props.onDelete || props.onUpdate) && (
        <CardActions>
          {props.onUpdate && (
            <IconButton aria-label="edit" onClick={handleEdit}>
              <EditIcon />
            </IconButton>
          )}
          {props.onDelete && (
            <IconButton
              aria-label="delete"
              onClick={handleDelete}
              style={{ marginLeft: 'auto' }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export const RoleItem = RoleItemComponent;
