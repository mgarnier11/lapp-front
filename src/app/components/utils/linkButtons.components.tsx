import React, { ReactChild, ReactFragment, ReactPortal } from 'react';

import { IconButtonProps, IconButton } from '@material-ui/core';
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
