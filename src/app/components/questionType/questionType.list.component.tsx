import React from 'react';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { QuestionType } from '../../../api/classes/questionType.class';
import { Grid, useMediaQuery, Box } from '@material-ui/core';

import { QuestionTypeItem } from './questionType.item.component';
import { Helper } from '../../../helper';

const useStyles = makeStyles(theme => ({
  questionTypesGrid: {
    [theme.breakpoints.down('xs')]: {
      paddingTop: 48
    }
  },
  questionTypeCol: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    height: 'fit-content'
  },
  questionTypeItem: {
    padding: theme.spacing(1)
  }
}));

interface OwnProps {
  questionTypes: QuestionType[];
  onDelete?: (questionTypeId: string) => void;
  onUpdate?: (questionType: QuestionType) => void;
}

type Props = OwnProps;

const QuestionTypeListComponent: React.FunctionComponent<Props> = props => {
  const classes = useStyles();
  const theme = useTheme();
  //const isXs = useMediaQuery(theme.breakpoints.up('xs'));
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  const { questionTypes } = props;

  const questionTypeCols = Helper.explodeArray(
    questionTypes,
    isLg ? 3 : isSm ? 2 : 1
  );

  return (
    <Box>
      <Grid className={classes.questionTypesGrid} container>
        {questionTypeCols.map((questionTypeList, index) => (
          <Grid
            key={index}
            item
            container
            xs={12}
            sm={6}
            lg={4}
            className={classes.questionTypeCol}
          >
            {questionTypeList.map(questionType => (
              <Grid
                key={questionType.id}
                item
                xs={12}
                className={classes.questionTypeItem}
              >
                <QuestionTypeItem
                  questionType={questionType}
                  onDelete={props.onDelete}
                  onUpdate={props.onUpdate}
                />
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export const QuestionTypeList = QuestionTypeListComponent;
