import React from 'react';
import { Container, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  text: {
    marginTop: theme.spacing(5)
  }
}));

interface OwnProps {
  displayId: string;
}

type Props = OwnProps;

const GameNotFound: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  return (
    <Container maxWidth="md" className={classes.root}>
      <Typography variant="h5" align="center" className={classes.text}>
        Error: Game with displayId: <b>{props.displayId}</b> not found
      </Typography>
    </Container>
  );
};

export default GameNotFound;
