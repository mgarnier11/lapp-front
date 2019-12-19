import React from 'react';
import { Container, Typography, makeStyles } from '@material-ui/core';
import { withRouter, RouteComponentProps } from 'react-router';

const useStyles = makeStyles(theme => ({
  root: {},
  text: {
    marginTop: theme.spacing(5)
  }
}));

interface OwnProps {
  displayId?: string;
}

type Props = OwnProps & RouteComponentProps;

const GameNotFound: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  const displayId = props.displayId || props.location.state.displayId;

  return (
    <Container maxWidth="md" className={classes.root}>
      <Typography variant="h5" align="center" className={classes.text}>
        Error: Game with displayId: <b>{displayId}</b> not found or you are not
        allowed in it
      </Typography>
    </Container>
  );
};

export default withRouter(GameNotFound);
