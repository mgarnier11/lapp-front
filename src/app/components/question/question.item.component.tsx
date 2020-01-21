import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Question } from '../../../api/classes/question.class';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Grid,
  Box
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import Rating from '@material-ui/lab/Rating';
import FavoriteIcon from '@material-ui/icons/Favorite';

const useStyles = makeStyles(theme => ({
  deleteButton: {
    marginLeft: 'auto'
  },
  hotLevelRating: {
    color: '#FD6C9E',
    textAlign: 'center'
  }
}));

interface OwnProps {
  question: Question;
  onDelete?: (questionId: string) => void;
  onUpdate?: (question: Question) => void;
  onDetails?: (question: Question) => void;
}

interface DispatchProps {}

interface StateProps {}

type Props = StateProps & OwnProps & DispatchProps;

const QuestionItemComponent: React.FunctionComponent<Props> = props => {
  const classes = useStyles();

  const { question } = props;

  return (
    <Card style={{ marginTop: 20 }}>
      <CardHeader title={question.type.name} />
      <CardContent>
        <Typography variant="body1">{question.text}</Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Box textAlign="center">
              <Typography>Difficulty</Typography>
              <Rating readOnly name="difficulty" value={question.difficulty} />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box textAlign="center">
              <Typography>Hot Level</Typography>
              <Rating
                readOnly
                name="hotLevel"
                className={classes.hotLevelRating}
                value={question.hotLevel}
                icon={<FavoriteIcon fontSize="inherit" />}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions disableSpacing>
        {!props.onDetails && (
          <IconButton onClick={() => props.onDetails}>
            <ZoomOutMapIcon />
          </IconButton>
        )}

        {!props.onUpdate && (
          <IconButton onClick={() => props.onUpdate}>
            <EditIcon />
          </IconButton>
        )}

        {!props.onDelete && (
          <IconButton
            onClick={() => props.onDelete}
            className={classes.deleteButton}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};

export const QuestionItem = QuestionItemComponent;
