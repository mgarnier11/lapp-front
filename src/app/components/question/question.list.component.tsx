import React, { useState } from 'react';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { Question } from '../../../api/classes/question.class';
import {
  Grid,
  useMediaQuery,
  Box,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Hidden,
  ClickAwayListener,
  Switch
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FavoriteIcon from '@material-ui/icons/Favorite';

import { QuestionItem } from './question.item.component';
import { Helper } from '../../../helper';
import Rating from '@material-ui/lab/Rating';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../../store';
import { UserState } from '../../../store/user/types';
import { connect } from 'react-redux';

const useStyles = makeStyles(theme => ({
  questionsGrid: {
    [theme.breakpoints.down('xs')]: {
      paddingTop: 48
    }
  },
  questionCol: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    height: 'fit-content'
  },
  questionItem: {
    padding: theme.spacing(1)
  },
  filters: {
    width: '100%',
    position: 'fixed',
    zIndex: 1
  },
  filterLine: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 46
  },
  hotLevelRating: {
    color: '#FD6C9E'
  }
}));

interface DispatchProps {}

interface OwnProps {
  questions: Question[];
  onDelete?: (questionId: string) => void;
  onUpdate?: (question: Question) => void;
  onDetails?: (question: Question) => void;
}

interface StateProps {
  userState: UserState;
}

type Props = DispatchProps & OwnProps & StateProps;

const QuestionListComponent: React.FunctionComponent<Props> = props => {
  const classes = useStyles();
  const theme = useTheme();
  //const isXs = useMediaQuery(theme.breakpoints.up('xs'));
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  const [filterOpen, setFilterOpen] = useState(false);
  const [maxDifficultyFilter, setMaxDifficultyFilter] = useState(5);
  const [maxHotLevelFilter, setMaxHotLevelFilter] = useState(5);
  const [userQuestionsOnly, setUserQuestionsOnly] = useState(false);

  const handleDifficultyLevel = (e: any, newValue: number) =>
    setMaxDifficultyFilter(newValue);
  const handleMaxHotLevel = (e: any, newValue: number) =>
    setMaxHotLevelFilter(newValue);
  const handleUserQuestions = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUserQuestionsOnly(e.target.checked);

  const { questions } = props;

  const filteredQuestions = questions.filter(
    q =>
      q.difficulty <= maxDifficultyFilter &&
      q.hotLevel <= maxHotLevelFilter &&
      (userQuestionsOnly ? q.creator.id === props.userState.user!.id : true)
  );

  const questionCols = Helper.explodeArray(
    filteredQuestions,
    isLg ? 3 : isSm ? 2 : 1
  );

  const renderFilters = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={4} className={classes.filterLine}>
          <Box mr={2}>
            <Typography>Max Difficulty</Typography>
          </Box>
          <Rating
            name="difficulty"
            value={maxDifficultyFilter}
            onChange={handleDifficultyLevel}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className={classes.filterLine}>
          <Box mr={2}>
            <Typography>Max Hot Level</Typography>
          </Box>
          <Rating
            name="hotLevel"
            className={classes.hotLevelRating}
            value={maxHotLevelFilter}
            onChange={handleMaxHotLevel}
            icon={<FavoriteIcon fontSize="inherit" />}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} className={classes.filterLine}>
          <Box mr={2}>
            <Typography>My Questions only</Typography>
          </Box>
          <Switch
            checked={userQuestionsOnly}
            onChange={handleUserQuestions}
            value="checkedA"
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <Box>
      <Hidden smUp>
        <ClickAwayListener onClickAway={() => setFilterOpen(false)}>
          <ExpansionPanel
            className={classes.filters}
            elevation={2}
            expanded={filterOpen}
          >
            <ExpansionPanelSummary
              onClick={() => setFilterOpen(!filterOpen)}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="filters-content"
              id="filters-header"
            >
              <Typography>Filters</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>{renderFilters()}</ExpansionPanelDetails>
          </ExpansionPanel>
        </ClickAwayListener>
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
            {questionList.map(question => (
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
                  onDetails={props.onDetails}
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
    userState: states.userState
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
