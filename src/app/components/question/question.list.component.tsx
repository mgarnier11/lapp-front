import React, { useState } from 'react';
import { useTheme, makeStyles, withStyles } from '@material-ui/core/styles';
import { Question } from '../../../api/classes/question.class';
import {
  Grid,
  useMediaQuery,
  Box,
  Typography,
  Hidden,
  Switch,
  Button,
  Drawer,
  Slider,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { QuestionItem } from './question.item.component';
import { Helper } from '../../../helper';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../../store';
import { UserState } from '../../../store/user/types';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  questionsGrid: {
    [theme.breakpoints.down('xs')]: {
      paddingTop: 48,
    },
  },
  questionCol: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    height: 'fit-content',
  },
  questionItem: {
    padding: theme.spacing(1),
  },
  hotLevelRating: {
    color: '#FD6C9E',
  },
  filtersLine: {
    [theme.breakpoints.up('sm')]: {
      paddingLeft: '16px !important',
      paddingRight: '16px !important',
    },
    display: 'flex',
    alignItems: 'center',
  },
  filtersDrawerRoot: {},
  filtersDrawerPaper: {
    marginTop: 112,
    paddingLeft: 5,
    paddingRight: 13,
    paddingTop: 5,
    paddingBottom: 8,
  },
  filtersSlider: {
    display: 'flex',
    alignItems: 'center',
  },
  filtersButton: {
    display: 'flex',
    textAlign: 'left',
    borderRadius: 0,
    zIndex: 1150,
    position: 'fixed',
    height: 48,
  },
  filtersButtonIcon: {
    marginLeft: 'auto',
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  filtersButtonIconExpanded: {
    transform: 'rotate(180deg)',
  },
  valueLabel: {
    zIndex: 1500,
  },
}));

interface DispatchProps {}

interface OwnProps {
  questions: Question[];
  onDelete?: (questionId: string) => void;
  onUpdate?: (question: Question) => void;
}

interface StateProps {
  userState: UserState;
}

type Props = DispatchProps & OwnProps & StateProps;

const StarSlider = withStyles({
  root: {
    marginLeft: 'auto',
    marginRight: '10px',
    width: '55%',
    color: '#FFB400',
  },
  thumb: {
    '&::before': {
      content: '"★"',
      fontSize: '250%',
    },
  },
  valueLabel: {
    zIndex: 1300,
    top: -40,
  },
})(Slider);

const HeartSlider = withStyles({
  root: {
    marginLeft: 'auto',
    marginRight: '10px',
    width: '55%',
    color: '#FD6C9E',
  },
  thumb: {
    '&::before': {
      content: '"❤"',
      fontSize: '210%',
    },
  },
  valueLabel: {
    zIndex: 1300,
    top: -40,
  },
})(Slider);

const QuestionListComponent: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  //const isXs = useMediaQuery(theme.breakpoints.up('xs'));
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  const { questions } = props;

  const [filterOpen, setFilterOpen] = useState(false);
  const [maxDifficultyFilters, setMaxDifficultyFilters] = React.useState<
    number[]
  >([1, 5]);
  const [maxHotLevelFilters, setMaxHotLevelFilters] = React.useState<number[]>([
    1,
    5,
  ]);
  const [userQuestionsOnly, setUserQuestionsOnly] = useState(false);

  const handleUserQuestions = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUserQuestionsOnly(e.target.checked);

  const handleMaxDifficultyChange = (event: any, newValue: number | number[]) =>
    setMaxDifficultyFilters(newValue as number[]);
  const handleMaxHotLevelChange = (event: any, newValue: number | number[]) =>
    setMaxHotLevelFilters(newValue as number[]);

  const filteredQuestions = questions
    .filter(
      (q) =>
        q.difficulty >= maxDifficultyFilters[0] &&
        q.difficulty <= maxDifficultyFilters[1] &&
        q.hotLevel >= maxHotLevelFilters[0] &&
        q.hotLevel <= maxHotLevelFilters[1] &&
        (userQuestionsOnly ? q.creator.id === props.userState.user!.id : true)
    )
    .sort((q1, q2) => q1.creationDate.getTime() - q2.creationDate.getTime());

  const questionCols = Helper.explodeArray(
    filteredQuestions,
    isLg ? 3 : isSm ? 2 : 1
  );

  const renderFilters = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={4} className={classes.filtersLine}>
          <Box mr={2}>
            <Typography>My questions only</Typography>
          </Box>
          <Switch
            checked={userQuestionsOnly}
            onChange={handleUserQuestions}
            value="checkedA"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className={classes.filtersLine}>
          <Box mr={2}>
            <Typography>Max Difficulty</Typography>
          </Box>
          <StarSlider
            value={maxDifficultyFilters}
            onChange={handleMaxDifficultyChange}
            valueLabelDisplay="auto"
            marks
            step={1}
            min={1}
            max={5}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className={classes.filtersLine}>
          <Box mr={2}>
            <Typography>Max Hot Level</Typography>
          </Box>
          <HeartSlider
            value={maxHotLevelFilters}
            onChange={handleMaxHotLevelChange}
            valueLabelDisplay="auto"
            marks
            step={1}
            min={1}
            max={5}
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <Box>
      <Hidden smUp>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className={classes.filtersButton}
          onClick={() => setFilterOpen(!filterOpen)}
        >
          Filters
          <ExpandMoreIcon
            className={`${classes.filtersButtonIcon} ${
              filterOpen ? classes.filtersButtonIconExpanded : ''
            }`}
          />
        </Button>
        <Drawer
          open={filterOpen}
          anchor="top"
          className={classes.filtersDrawerRoot}
          classes={{ paper: classes.filtersDrawerPaper }}
          onClose={() => setFilterOpen(false)}
          style={{ zIndex: 1100 }}
        >
          {renderFilters()}
        </Drawer>
      </Hidden>
      <Hidden xsDown>{renderFilters()}</Hidden>
      <Grid className={classes.questionsGrid} container>
        {questionCols.map((questionList, index) => (
          <Grid
            key={index}
            item
            container
            xs={12}
            sm={6}
            lg={4}
            className={classes.questionCol}
          >
            {questionList.map((question, index) => (
              <Grid
                key={question.id}
                item
                xs={12}
                className={classes.questionItem}
              >
                <QuestionItem
                  question={question}
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
const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    userState: states.userState,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {};
};

export const QuestionList = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  RootState
>(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
  QuestionListComponent
);
