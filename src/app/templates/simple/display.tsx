import React from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { Box, Grid, Avatar, makeStyles, Typography } from '@material-ui/core';
import { connect } from 'react-redux';

import { Question } from '../../../api/classes/question.class';
import { UserState } from '../../../store/user/types';
import { RootState } from '../../../store';
import { TemplateDisplayProps } from '../templateDisplay';
import { GameState } from '../../../store/game/types';
import { MyAvatar } from '../../components/utils/myAvatar.component';

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center',
    height: 'calc(100vh - 64px)',
    display: 'flex',
    [`@media (orientation: portrait)`]: {
      flexDirection: 'column'
    }
  },
  panel: {
    display: 'flex',
    flex: 1
  },
  userImg: {
    width: '50%',
    height: 0,
    paddingBottom: '50%'
  }
}));

interface OwnProps {}

type Props = OwnProps & TemplateDisplayProps;

const SimpleQuestionTemplate: React.FunctionComponent<Props> = (
  props: Props
) => {
  const classes = useStyles();

  const playingGame = props.playingGame;
  return (
    <Box component="div" className={classes.root}>
      <Box component="div" className={classes.panel}>
        <MyAvatar src="/dummyimg.jpg" percentSize={65} />
        <Typography>{playingGame.getActualplayer().name}</Typography>
      </Box>
      <Box component="div" className={classes.panel}>
        <Box>
          <Typography></Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SimpleQuestionTemplate;
