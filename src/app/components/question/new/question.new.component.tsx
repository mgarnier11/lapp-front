import * as lodash from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextareaAutosize
} from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import {
  withStyles,
  WithStyles,
  createStyles,
  StyleRules,
  Theme
} from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import FavoriteIcon from '@material-ui/icons/Favorite';

import { RootState } from '../../../../store';
import { questionCreate } from '../../../../store/question/actions';
import { addError } from '../../../../store/error/actions';
import { Question } from '../../../../api/classes/question.class';
import { Loading } from '../../loading/loading.component';
import { questionTypeGetAll } from '../../../../store/questionType/actions';
import { QuestionTypeState } from '../../../../store/questionType/types';

const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'fit-content'
    },
    card: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
    cardContent: {
      paddingLeft: '0',
      paddingRight: '0'
    },
    textArea: {
      width: '100%'
    },
    hotLevelRating: {
      color: '#FD6C9E'
    }
  });

interface OwnProps {}

interface DispatchProps {
  questionCreate: (question: Partial<Question>) => Promise<any>;
  questionTypeGetAll: () => void;
  addError: (error: any) => void;
}

interface StateProps {
  questionTypeState: QuestionTypeState;
}

type Props = StateProps &
  OwnProps &
  DispatchProps &
  WithSnackbarProps &
  WithStyles<typeof styles>;

interface ComponentState {
  question: Question;
}

class QuestionNewComponent extends React.Component<Props, ComponentState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      question: new Question()
    };
  }

  reloadDatas() {
    if (
      !this.props.questionTypeState.questionTypes &&
      !this.props.questionTypeState.loading
    ) {
      this.props.questionTypeGetAll();
    }
  }

  componentDidMount() {
    this.reloadDatas();
  }

  componentDidUpdate() {
    this.reloadDatas();
  }

  handleDifficultyChange = (e: any, value: number) => {
    this.setState({ question: { ...this.state.question, difficulty: value } });
  };

  handleHotLevelChange = (e: any, value: number) => {
    this.setState({ question: { ...this.state.question, hotLevel: value } });
  };

  handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      question: { ...this.state.question, text: e.target.value }
    });
  };

  render() {
    const classes = this.props.classes;
    const { difficulty, hotLevel, text } = this.state.question;

    return (
      <Container component="main" className={classes.root}>
        <Card className={classes.card}>
          <CardHeader title="Create a new question" />
          <CardContent className={classes.cardContent}>
            <Box component="fieldset" mb={3} borderColor="transparent">
              <Typography component="legend">Text</Typography>
              <TextareaAutosize
                className={classes.textArea}
                rows={2}
                value={text}
                onChange={this.handleTextChange}
              />
            </Box>
            <Box component="fieldset" mb={3} borderColor="transparent">
              <Typography component="legend">Difficulty</Typography>
              <Rating
                value={difficulty}
                onChange={this.handleDifficultyChange}
              />
            </Box>
            <Box component="fieldset" mb={3} borderColor="transparent">
              <Typography component="legend">Hot Level</Typography>
              <Rating
                className={classes.hotLevelRating}
                value={hotLevel}
                onChange={this.handleHotLevelChange}
                icon={<FavoriteIcon fontSize="inherit" />}
              />
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    questionTypeState: states.questionTypeState.questionType
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    questionCreate: async (question: Partial<Question>) => {
      return await dispatch(questionCreate(question));
    },
    questionTypeGetAll: async () => {
      await dispatch(questionTypeGetAll());
    },
    addError: async (error: any) => {
      await dispatch(addError(error));
    }
  };
};

export default connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withSnackbar(QuestionNewComponent)));
