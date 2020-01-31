import React from 'react';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { QuestionTemplate } from '../../../api/classes/questionTemplate.class';
import { Grid, useMediaQuery, Box } from '@material-ui/core';

import { QuestionTemplateItem } from './questionTemplate.item.component';
import { Helper } from '../../../helper';

const useStyles = makeStyles(theme => ({
  questionTemplatesGrid: {
    paddingTop: theme.spacing(1)
  },
  questionTemplateCol: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    height: 'fit-content'
  },
  questionTemplateItem: {
    padding: theme.spacing(1)
  }
}));

interface OwnProps {
  questionTemplates: QuestionTemplate[];
  onDelete?: (questionTemplateId: string) => void;
  onUpdate?: (questionTemplate: QuestionTemplate) => void;
}

type Props = OwnProps;

const QuestionTemplateListComponent: React.FunctionComponent<Props> = props => {
  const classes = useStyles();
  const theme = useTheme();
  //const isXs = useMediaQuery(theme.breakpoints.up('xs'));
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  const { questionTemplates } = props;

  const questionTemplateCols = Helper.explodeArray(
    questionTemplates,
    isLg ? 3 : isSm ? 2 : 1
  );

  return (
    <Box>
      <Grid className={classes.questionTemplatesGrid} container>
        {questionTemplateCols.map((questionTemplateList, index) => (
          <Grid
            key={index}
            item
            container
            xs={12}
            sm={6}
            lg={4}
            className={classes.questionTemplateCol}
          >
            {questionTemplateList.map(questionTemplate => (
              <Grid
                key={questionTemplate.id}
                item
                xs={12}
                className={classes.questionTemplateItem}
              >
                <QuestionTemplateItem
                  questionTemplate={questionTemplate}
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

export const QuestionTemplateList = QuestionTemplateListComponent;
