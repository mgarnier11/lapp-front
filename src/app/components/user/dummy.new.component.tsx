import React from 'react';
import { Container, Card, CardContent, CardHeader } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { DummyUser } from '../../../api/classes/dummyUser.class';
import { DummyUserForm } from './dummy.form.component';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fit-content',
    outline: 'none',
    maxWidth: '400px',
  },
  card: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    textAlign: 'center',
  },
  cardContent: {
    padding: '0',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

interface OwnProps {
  dummyUserCreate: (dummyUser: DummyUser) => void;
}

interface DispatchProps {}

interface StateProps {}

type Props = StateProps & OwnProps & DispatchProps;

const DummyUserNewComponent: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles();

  const handleSubmit = (dummyUser: DummyUser) => {
    props.dummyUserCreate(dummyUser);
  };

  return (
    <Container component="main" className={classes.root} tabIndex={-1}>
      <Card className={classes.card} raised={true}>
        <CardHeader title="Create a new temporary user" />
        <CardContent className={classes.cardContent}>
          <DummyUserForm
            dummyUser={DummyUser.New({})}
            editable
            onSubmit={handleSubmit}
            acceptButtonText="Create temporary user"
          />
        </CardContent>
      </Card>
    </Container>
  );
};

export const DummyUserNew = DummyUserNewComponent;
