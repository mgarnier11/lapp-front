import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Question } from '../../../api/classes/question.class';
import { Grid, useMediaQuery } from '@material-ui/core';

import { QuestionItem } from './question.item.component';
import { Helper } from '../../../helper';

//const useStyles = makeStyles(theme => ({}));

interface OwnProps {
  questions: Question[];
  onDelete?: (questionId: string) => void;
  onUpdate?: (question: Question) => void;
  onDetails?: (question: Question) => void;
}

type Props = OwnProps;

const QuestionListComponent: React.FunctionComponent<Props> = props => {
  //const classes = useStyles();
  const theme = useTheme();
  //const isXs = useMediaQuery(theme.breakpoints.up('xs'));
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  const { questions } = props;

  const questionCols = Helper.explodeArray(questions, isLg ? 3 : isSm ? 2 : 1);

  return (
    <>
      <Grid
        container
        spacing={2}
        style={{ margin: questionCols.length > 1 ? -8 : 0 }}
      >
        {questionCols.map((questionList, index) => (
          <Grid
            key={index}
            item
            container
            spacing={2}
            xs={12}
            sm={6}
            lg={4}
            style={{ height: 'fit-content' }}
          >
            {questionList.map(question => (
              <Grid key={question.id} item xs={12}>
                <QuestionItem
                  question={question}
                  onDelete={props.onDelete}
                  onUpdate={props.onUpdate}
                  onDetails={props.onDetails}
                />
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export const QuestionList = QuestionListComponent;
