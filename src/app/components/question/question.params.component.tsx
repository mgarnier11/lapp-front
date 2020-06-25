import React, { useState } from 'react';
import {
  makeStyles,
  Grid,
  TextField,
  MenuItem,
  Button,
} from '@material-ui/core';
import { TextParameter } from '../../../api/classes/question.class';

const useStyles = makeStyles((theme) => ({
  selectParam: {
    margin: 0,
  },
  addParamButtonContainer: {
    alignSelf: 'center',
    paddingLeft: '20px',
  },
}));

interface OtherProps {}

type Props = OtherProps;

const QuestionParam: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  const [parameter, setParameter] = useState<TextParameter>();

  return (
    <Grid container>
      <Grid item xs={8}>
        <TextField
          className={classes.selectParam}
          name="parameterSelect"
          margin="normal"
          variant="outlined"
          select
          fullWidth
          id="parameterSelect"
          label="Text parameter"
          // value={props.editable ? type.id : type.name}
          // onChange={handleTypeChange}
        >
          <MenuItem disabled>Loading...</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={4} className={classes.addParamButtonContainer}>
        <Button variant="contained" color="primary" fullWidth>
          Add parameter
        </Button>
      </Grid>
    </Grid>
  );
};

export default QuestionParam;
