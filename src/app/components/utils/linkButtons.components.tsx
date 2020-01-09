import React, { ReactChild, ReactFragment, ReactPortal } from 'react';

import {
  IconButtonProps,
  IconButton,
  ListItemIconProps,
  ListItemIcon,
  ListItemProps,
  ListItem
} from '@material-ui/core';
import { Link } from 'react-router-dom';

interface CustomProps {
  to: string;
  children:
    | ReactChild
    | ReactFragment
    | ReactPortal
    | boolean
    | null
    | undefined;
}

type IconButtonLinkProps = CustomProps & IconButtonProps;

export const IconButtonLink = (props: IconButtonLinkProps) => (
  <IconButton {...props}>
    <Link to={props.to}>{props.children}</Link>
  </IconButton>
);

type ListItemIconLinkProps = CustomProps & ListItemIconProps;

export const ListItemIconLink = (props: ListItemIconLinkProps) => (
  <ListItemIcon {...props}>
    <Link to={props.to}>{props.children}</Link>
  </ListItemIcon>
);

type ListItemLinkProps = CustomProps & { onClick?: () => void };

export const ListItemLink = (props: ListItemLinkProps) => (
  <Link to={props.to}>
    <ListItem button onClick={props.onClick}>
      {props.children}
    </ListItem>
  </Link>
);
