import * as lodash from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Container, Select, MenuItem, TextField } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import MaterialTable, { Column, EditComponentProps } from 'material-table';
import {
  withStyles,
  WithStyles,
  StyleRules,
  createStyles,
  Theme
} from '@material-ui/core/styles';
import FavoriteIcon from '@material-ui/icons/Favorite';

import { QuestionsState } from '../../../store/questions/types';
import { RootState } from '../../../store';
import { QuestionsActions } from '../../../store/questions/actions';
import { addError } from '../../../store/errors/actions';
import { Question } from '../../../api/classes/question.class';
import { Loading } from '../../components/loading/loading.component';
import { QuestionTypesActions } from '../../../store/questionTypes/actions';
import { QuestionTypesState } from '../../../store/questionTypes/types';
import Rating from '@material-ui/lab/Rating';

const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(12)
    }
  });

interface OwnProps {}

interface DispatchProps {
  questionUpdate: (question: Question) => Promise<any>;
  questionRemove: (questionId: string) => Promise<any>;
  questionGetAll: () => void;
  questionTypeGetAll: () => void;
  addError: (error: any) => void;
}

interface StateProps {
  questionsState: QuestionsState;
  questionTypesState: QuestionTypesState;
}

type Props = StateProps &
  OwnProps &
  DispatchProps &
  WithSnackbarProps &
  WithStyles<typeof styles>;

interface ComponentState {
  columns: Array<Column<Question>>;
  questions: Question[];
}

class Questions extends React.Component<Props, ComponentState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      columns: [
        {
          title: 'Text',
          field: 'text',
          editComponent: rowData => (
            <TextField
              style={{ width: '100%', margin: '0' }}
              multiline
              margin="normal"
              variant="outlined"
              value={rowData.rowData.text}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                rowData.onChange(e.target.value)
              }
            />
          )
        },
        {
          title: 'Type',
          field: 'type',
          render: rowData => rowData.type.name,
          editComponent: rowData => (
            <Select
              style={{ textAlign: 'left', width: '100%' }}
              labelId="type-select-label"
              id="type-select"
              value={rowData.rowData.type.id}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                this.handleTypeChange(e, rowData);
              }}
            >
              {this.props.questionTypesState.questionTypes ? (
                this.props.questionTypesState.questionTypes.map(t => (
                  <MenuItem value={t.id} key={t.id}>
                    {t.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Loading...</MenuItem>
              )}
            </Select>
          )
        },
        {
          title: 'Difficulty',
          field: 'difficulty',
          render: rowData => (
            <Rating name="difficulty" value={rowData.difficulty} readOnly />
          ),
          editComponent: rowData => (
            <Rating
              name="difficulty"
              value={rowData.rowData.difficulty}
              onChange={(e: any, value: number) => rowData.onChange(value)}
            />
          )
        },
        {
          title: 'Hot Level',
          field: 'hotLevel',
          render: rowData => (
            <Rating
              name="hotLevel"
              style={{ color: '#FD6C9E' }}
              value={rowData.hotLevel}
              readOnly
              icon={<FavoriteIcon fontSize="inherit" />}
            />
          ),
          editComponent: rowData => (
            <Rating
              name="hotLevel"
              style={{ color: '#FD6C9E' }}
              value={rowData.rowData.hotLevel}
              onChange={(e: any, value: number) => rowData.onChange(value)}
              icon={<FavoriteIcon fontSize="inherit" />}
            />
          )
        }
      ],
      questions: []
    };
  }

  handleTypeChange = (
    e: React.ChangeEvent<{ value: unknown }>,
    rowData: EditComponentProps<Question>
  ) => {
    const questionTypes = this.props.questionTypesState.questionTypes;

    if (questionTypes) {
      rowData.onChange(
        questionTypes.find(t => t.id === (e.target.value as string))!
      );
    }
  };

  reloadDatas() {
    if (
      !this.props.questionsState.questions &&
      !this.props.questionsState.loading
    ) {
      this.props.questionGetAll();
    }
    if (
      !this.props.questionTypesState.questionTypes &&
      !this.props.questionTypesState.loading
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

  static getDerivedStateFromProps(nextProps: Props, prevState: ComponentState) {
    let nextQuestions = nextProps.questionsState.questions;
    if (nextQuestions) {
      let prevQuestions = prevState.questions;

      if (!Question.CompareArrays(nextQuestions, prevQuestions)) {
        return {
          questions: lodash.cloneDeep(nextQuestions)
        };
      }
    }

    return null;
  }

  render() {
    const classes = this.props.classes;

    return (
      <Container component="main" className={classes.root}>
        {this.props.questionsState.questions
          ? this.renderTable(this.state.questions)
          : this.renderLoading()}
      </Container>
    );
  }

  renderTable(questions: Question[]) {
    return (
      <MaterialTable
        title="Questions Table"
        columns={this.state.columns}
        data={questions}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise(async (resolve, reject) => {
              let updatedQuestion = Question.New(newData);
              let updated = await this.props.questionUpdate(updatedQuestion);
              if (updated) resolve();
              else reject();
            }),
          onRowDelete: oldData =>
            new Promise(async (resolve, reject) => {
              let deleted = await this.props.questionRemove(oldData.id);
              if (deleted) resolve();
              else reject();
            })
        }}
        options={{ pageSize: 10, pageSizeOptions: [10, 25, 50] }}
      />
    );
  }

  renderLoading() {
    return <Loading />;
  }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  console.log(states);

  return {
    questionsState: states.questionsState,
    questionTypesState: states.questionTypesState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    questionUpdate: async (question: Question) => {
      return await dispatch(QuestionsActions.questionUpdate(question));
    },
    questionRemove: async (questionId: string) => {
      return await dispatch(QuestionsActions.questionRemove(questionId));
    },
    questionGetAll: async () => {
      await dispatch(QuestionsActions.questionGetAll());
    },
    questionTypeGetAll: async () => {
      await dispatch(QuestionTypesActions.questionTypeGetAll());
    },
    addError: async (error: any) => {
      await dispatch(addError(error));
    }
  };
};

export default connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withSnackbar(Questions)));
