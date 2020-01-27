import * as lodash from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Container } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import MaterialTable, { Column } from 'material-table';
import {
  withStyles,
  WithStyles,
  StyleRules,
  createStyles,
  Theme
} from '@material-ui/core/styles';

import { QuestionTypesState } from '../../../store/questionTypes/types';
import { RootState } from '../../../store';
import { QuestionTypesActions } from '../../../store/questionTypes/actions';
import { addError } from '../../../store/errors/actions';
import { QuestionType } from '../../../api/classes/questionType.class';
import { Loading } from '../../components/utils/loading.component';

const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(10)
    }
  });

interface OwnProps {}

interface DispatchProps {
  questionTypeCreate: (questionType: Partial<QuestionType>) => Promise<any>;
  questionTypeUpdate: (questionType: QuestionType) => Promise<any>;
  questionTypeRemove: (questionTypeId: string) => Promise<any>;
  questionTypeGetAll: () => void;
  addError: (error: any) => void;
}

interface StateProps {
  questionTypesState: QuestionTypesState;
}

type Props = StateProps &
  OwnProps &
  DispatchProps &
  WithSnackbarProps &
  WithStyles<typeof styles>;

interface ComponentState {
  columns: Array<Column<QuestionType>>;
  questionTypes: QuestionType[];
}

// TODO Convert to questionTypePage to funtionnal component
class QuestionTypesPage extends React.Component<Props, ComponentState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      columns: [
        { title: 'Name', field: 'name' },
        { title: 'Description', field: 'description' }
      ],
      questionTypes: []
    };
  }

  reloadDatas() {
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
    let nextQuestionTypes = nextProps.questionTypesState.questionTypes;
    if (nextQuestionTypes) {
      let prevQuestionTypes = prevState.questionTypes;

      if (!QuestionType.CompareArrays(nextQuestionTypes, prevQuestionTypes)) {
        return {
          questionTypes: lodash.cloneDeep(nextQuestionTypes)
        };
      }
    }

    return null;
  }

  render() {
    const classes = this.props.classes;

    return (
      <Container component="main" className={classes.root}>
        {this.props.questionTypesState.questionTypes
          ? this.renderTable(this.state.questionTypes)
          : this.renderLoading()}
      </Container>
    );
  }

  renderTable(questionTypes: QuestionType[]) {
    return (
      <MaterialTable
        title="Types Table"
        columns={this.state.columns}
        data={questionTypes}
        editable={{
          onRowAdd: newData =>
            new Promise(async (resolve, reject) => {
              let newQuestionType = QuestionType.New(newData);
              let created = await this.props.questionTypeCreate(
                newQuestionType
              );
              if (created) resolve();
              else reject();
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise(async (resolve, reject) => {
              let updatedQuestionType = QuestionType.New(newData);
              let updated = await this.props.questionTypeUpdate(
                updatedQuestionType
              );
              if (updated) resolve();
              else reject();
            }),
          onRowDelete: oldData =>
            new Promise(async (resolve, reject) => {
              let deleted = await this.props.questionTypeRemove(oldData.id);
              if (deleted) resolve();
              else reject();
            })
        }}
        options={{ pageSize: 10, pageSizeOptions: [10] }}
      />
    );
  }

  renderLoading() {
    return <Loading />;
  }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    questionTypesState: states.questionTypesState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    questionTypeCreate: async (questionType: Partial<QuestionType>) => {
      return await dispatch(
        QuestionTypesActions.questionTypeCreate(questionType)
      );
    },
    questionTypeUpdate: async (questionType: QuestionType) => {
      return await dispatch(
        QuestionTypesActions.questionTypeUpdate(questionType)
      );
    },
    questionTypeRemove: async (questionTypeId: string) => {
      return await dispatch(
        QuestionTypesActions.questionTypeRemove(questionTypeId)
      );
    },
    questionTypeGetAll: async () => {
      await dispatch(QuestionTypesActions.questionTypeGetAll());
    },
    addError: async (error: any) => {
      await dispatch(addError(error));
    }
  };
};

export const QuestionTypes = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  RootState
>(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withSnackbar(QuestionTypesPage)));
