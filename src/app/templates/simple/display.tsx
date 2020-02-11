import React from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { Box, Grid, Avatar, makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';

import { Question } from '../../../api/classes/question.class';
import { UserState } from '../../../store/user/types';
import { RootState } from '../../../store';
import { TemplateDisplayProps } from '../templateDisplay';
import { GameState } from '../../../store/game/types';

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center'
  },
  userImg: {
    width: '50%',
    height: 0,
    paddingBottom: '50%'
  }
}));

interface OwnProps {}

interface DispatchProps {}

interface StateProps {
  userState: UserState;
  gameState: GameState;
}

type Props = StateProps & OwnProps & DispatchProps & TemplateDisplayProps;

const SimpleQuestionTemplate: React.FunctionComponent<Props> = (
  props: Props
) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Avatar src={'/dummyImg.jpg'} className={classes.userImg} />
        </Grid>
      </Grid>
    </Box>
  );
};

const mapStateToProps = (states: RootState): StateProps => {
  return { userState: states.userState, gameState: states.gameState };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {};
};

export default connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(SimpleQuestionTemplate);
