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
  TextareaAutosize,
  Grid,
  Select,
  MenuItem,
  Button,
  TextField,
  InputLabel,
  FormControl
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

import { RootState } from '../../../store';
import { QuestionActions } from '../../../store/question/actions';
import { addError } from '../../../store/error/actions';
import { Question } from '../../../api/classes/question.class';
import { Loading } from '../loading/loading.component';
import { QuestionTypeActions } from '../../../store/questionType/actions';
import { QuestionTypeState } from '../../../store/questionType/types';
import { QuestionState } from '../../../store/question/types';

const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'fit-content',
      outline: 'none'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center'
    },
    card: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      textAlign: 'center'
    },
    cardContent: {
      padding: '0',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    },
    formControl: {
      paddingBottom: theme.spacing(1)
    },
    textField: {
      width: '100%',
      marginTop: '1px'
    },
    select: {
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
  questionState: QuestionState;
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

    this.isDenied = this.isDenied.bind(this);
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

  handleTypeChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const questionTypes = this.props.questionTypeState.questionTypes;

    if (questionTypes) {
      this.setState({
        question: {
          ...this.state.question,
          type: questionTypes.find(t => t.id === (e.target.value as string))!
        }
      });
    } else {
      console.error(
        'Question types not loaded yet !',
        'How did you get here ?'
      );
    }
  };

  handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!this.isDenied()) {
      this.props
        .questionCreate(this.state.question)
        .then((question: Question) => {});
    }
  };

  isDenied(): boolean {
    const { difficulty, hotLevel, text, type } = this.state.question;
    const questionTypes = this.props.questionTypeState.questionTypes;
    const questionLoading = this.props.questionState.loading;
    return (
      questionLoading ||
      (questionTypes ? !questionTypes.includes(type) : true) ||
      difficulty === 0 ||
      hotLevel === 0 ||
      text.length === 0
    );
  }

  render() {
    const classes = this.props.classes;
    const { difficulty, hotLevel, text, type } = this.state.question;
    const questionTypes = this.props.questionTypeState.questionTypes;

    return (
      <Container component="main" className={classes.root} tabIndex={-1}>
        <Card className={classes.card} raised={true}>
          <CardHeader title="Create a new question" />
          <CardContent className={classes.cardContent}>
            <form className={classes.form} onSubmit={this.handleFormSubmit}>
              <FormControl className={classes.formControl}>
                <InputLabel id="type-select-label">Type</InputLabel>
                <Select
                  style={{ textAlign: 'left' }}
                  labelId="type-select-label"
                  id="type-select"
                  value={type.id}
                  className={classes.select}
                  onChange={this.handleTypeChange}
                >
                  {questionTypes ? (
                    questionTypes.map(t => (
                      <MenuItem value={t.id} key={t.id}>
                        {t.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Loading...</MenuItem>
                  )}
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <TextField
                  label="Text"
                  multiline
                  rows="3"
                  className={classes.textField}
                  margin="normal"
                  variant="outlined"
                  value={text}
                  onChange={this.handleTextChange}
                />
              </FormControl>
              <FormControl className={classes.formControl}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography component="legend">Difficulty</Typography>
                    <Rating
                      name="difficulty"
                      value={difficulty}
                      onChange={this.handleDifficultyChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography component="legend">Hot Level</Typography>
                    <Rating
                      name="hotLevel"
                      className={classes.hotLevelRating}
                      value={hotLevel}
                      onChange={this.handleHotLevelChange}
                      icon={<FavoriteIcon fontSize="inherit" />}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={this.isDenied()}
              >
                {questionTypes ? 'Create question' : 'Loading'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    );
  }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    questionTypeState: states.questionTypeState,
    questionState: states.questionState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    questionCreate: async (question: Partial<Question>) => {
      return await dispatch(QuestionActions.questionCreate(question));
    },
    questionTypeGetAll: async () => {
      await dispatch(QuestionTypeActions.questionTypeGetAll());
    },
    addError: async (error: any) => {
      await dispatch(addError(error));
    }
  };
};

export default connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(withStyles(styles)(withSnackbar(QuestionNewComponent)));
