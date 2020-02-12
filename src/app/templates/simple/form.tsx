import React from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import {
  TextField,
  Grid,
  Typography,
  Box,
  makeStyles
} from '@material-ui/core';

import Rating from '@material-ui/lab/Rating';
import FavoriteIcon from '@material-ui/icons/Favorite';

import { UserState } from '../../../store/user/types';
import { RootState } from '../../../store';
import { TemplateFormProps } from '../templateForm';
import { OutlinedDiv } from '../../components/utils/outlinedDiv.component';
import { UserItem } from '../../components/user/user.item.component';

const useStyles = makeStyles(theme => ({
  ratingsGrid: {
    width: 'calc(100% + 16px)',
    marginLeft: -8,
    textAlign: 'center'
  },
  hotLevelRating: {
    color: '#FD6C9E'
  }
}));

interface OtherProps {}

type Props = OtherProps & TemplateFormProps;

const SimpleQuestionTemplate: React.FunctionComponent<Props> = (
  props: Props
) => {
  const classes = useStyles();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    props.editable && props.formProps.setText(e.target.value);

  const handleDifficultyChange = (e: any, value: number) =>
    props.editable && props.formProps.setDifficulty(value);

  const handleHotLevelChange = (e: any, value: number) =>
    props.editable && props.formProps.setHotLevel(value);

  return (
    <>
      {props.displayText && (
        <TextField
          name="text"
          margin="normal"
          variant="outlined"
          type="text"
          disabled={props.disabled}
          fullWidth
          multiline
          rows={4}
          rowsMax={6}
          id="text"
          label="Text"
          value={props.formProps.text}
          onChange={handleTextChange}
        />
      )}

      <Grid container className={classes.ratingsGrid}>
        <Grid item xs={6}>
          <Typography
            component="legend"
            color={props.disabled ? 'textSecondary' : 'initial'}
          >
            Difficulty
          </Typography>
          <Rating
            disabled={props.disabled}
            readOnly={!props.editable}
            name="difficulty"
            value={props.formProps.difficulty}
            onChange={handleDifficultyChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography
            component="legend"
            color={props.disabled ? 'textSecondary' : 'initial'}
          >
            Hot Level
          </Typography>
          <Rating
            disabled={props.disabled}
            readOnly={!props.editable}
            name="hotLevel"
            className={classes.hotLevelRating}
            value={props.formProps.hotLevel}
            onChange={handleHotLevelChange}
            icon={<FavoriteIcon fontSize="inherit" />}
          />
        </Grid>
      </Grid>
      {props.displayExtraInfos && props.question && (
        <>
          <OutlinedDiv label="Creator" disabled={props.disabled} fullWidth>
            <UserItem user={props.question.creator} />
          </OutlinedDiv>
          <OutlinedDiv
            label="Creation Date"
            disabled={props.disabled}
            fullWidth
          >
            <Box m={1}>
              {props.question.creationDate.toLocaleDateString(
                'fr-FR',
                props.dateOptions
              )}
            </Box>
          </OutlinedDiv>
          <OutlinedDiv label="Update Date" disabled={props.disabled} fullWidth>
            <Box m={1}>
              {props.question.updateDate.toLocaleDateString(
                'fr-FR',
                props.dateOptions
              )}
            </Box>
          </OutlinedDiv>
        </>
      )}
    </>
  );
};

export default SimpleQuestionTemplate;
