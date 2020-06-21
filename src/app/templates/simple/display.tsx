import React from 'react';
import { Box, makeStyles, Typography, IconButton } from '@material-ui/core';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';

import { TemplateDisplayProps } from '../templateDisplay';
import {
  BaseAvatar,
  TypeAvatar,
} from '../../components/utils/avatars.component';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    height: 'calc(100vh - 64px)',
    display: 'flex',
    [`@media (orientation: portrait)`]: {
      flexDirection: 'column',
    },
  },
  panel: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  userImg: {
    width: '50%',
    height: 0,
    paddingBottom: '50%',
  },
  questionText: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
  },
  questionActions: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  questionActionButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    '& .MuiSvgIcon-root': {
      width: '2em',
      height: '2em',
    },
  },
  typeDisplay: {
    flex: 2,
    display: 'flex',
    alignSelf: 'center',
  },
}));

interface OwnProps {}

type Props = OwnProps & TemplateDisplayProps;

const SimpleQuestionTemplate: React.FunctionComponent<Props> = (
  props: Props
) => {
  const classes = useStyles();

  const playingGame = props.playingGame;
  const actualQuestion = props.question;
  const actualPlayer = playingGame.getActualplayer();

  return (
    <Box component="div" className={classes.root}>
      <Box component="div" className={classes.panel}>
        {actualPlayer && (
          <>
            <BaseAvatar
              src="/assets/dummyImg.jpg"
              // src="https://via.placeholder.com/450?text=Player%20image"
              percentSize={65}
            />
            <Typography variant="h6" component="h3">
              {actualPlayer.name}
            </Typography>
          </>
        )}
      </Box>
      <Box component="div" className={classes.panel}>
        <Box className={classes.questionText} px={3}>
          <Typography align="center" variant="body1">
            {actualQuestion.text}
          </Typography>
        </Box>
        <Box className={classes.questionActions}>
          <Box className={classes.questionActionButton}>
            <IconButton
              style={{ color: '#CF2A28' }}
              onClick={() => props.onDeny!(actualQuestion)!}
            >
              <CancelOutlinedIcon />
            </IconButton>
          </Box>
          <Box className={classes.typeDisplay}>
            <TypeAvatar
              type={actualQuestion.type}
              src="https://via.placeholder.com/450?text=Type%20image"
              percentSize={65}
            />
          </Box>

          <Box
            className={classes.questionActionButton}
            onClick={() => props.onAccept}
          >
            <IconButton
              style={{ color: '#6BA84F' }}
              onClick={() => props.onAccept!(actualQuestion)}
            >
              <CheckCircleOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SimpleQuestionTemplate;
