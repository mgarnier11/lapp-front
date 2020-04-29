import React, { useState, ReactNode } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store';
import { ThunkDispatch } from 'redux-thunk';
import { GameTypesActions } from '../store/gameTypes/actions';
import { QuestionTypesActions } from '../store/questionTypes/actions';
import { QuestionsActions } from '../store/questions/actions';
import { RolesActions } from '../store/roles/actions';
import { relog } from '../store/user/actions';
import { RolesState } from '../store/roles/types';
import { GamesState } from '../store/games/types';
import { QuestionTypesState } from '../store/questionTypes/types';
import { QuestionsState } from '../store/questions/types';
import { GameTypesState } from '../store/gameTypes/types';
import { useEffect } from 'react';
import { GamesActions } from '../store/games/actions';
import { Switch, Route, Redirect } from 'react-router';
import { Login } from './pages/auth/login/login.page';
import { Register } from './pages/auth/register/register.page';
import { UserState } from '../store/user/types';
import { Error } from './components/error/error.component';
import { Loading } from './components/utils/loading.component';
import { Box, Typography } from '@material-ui/core';
import { QuestionTemplatesState } from '../store/questionTemplates/types';
import { QuestionTemplatesActions } from '../store/questionTemplates/actions';
import { LoadingLogo } from './components/utils/loadingLogo.component';

interface OwnProps {
  children?: ReactNode;
}

interface DispatchProps {
  relog: () => Promise<any>;
  gameGetAll: () => Promise<any>;
  roleGetAll: () => Promise<any>;
  questionTypeGetAll: () => Promise<any>;
  gameTypeGetAll: () => Promise<any>;
  questionGetAll: () => Promise<any>;
  questionTemplateGetAll: () => Promise<any>;
}

interface StateProps {
  userState: UserState;
  gamesState: GamesState;
  gameTypesState: GameTypesState;
  rolesState: RolesState;
  questionTypesState: QuestionTypesState;
  questionsState: QuestionsState;
  questionTemplatesState: QuestionTemplatesState;
}

type Props = StateProps & OwnProps & DispatchProps;

const AppStartingComponent: React.FunctionComponent<Props> = (props: Props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    props.relog().then((isLogged) => {
      if (!isLogged) setLoading(false);
    });
  }, ['componentDidMount']);

  useEffect(() => {
    setLoading(true);

    if (props.userState.user) {
      Promise.all([
        props.gameGetAll(),
        props.roleGetAll(),
        props.questionTypeGetAll(),
        props.gameTypeGetAll(),
        props.questionGetAll(),
        props.questionTemplateGetAll(),
      ]).then((values) => {
        if (values.every((v) => v === true)) {
          setLoading(false);
        } else {
          console.log('error in loading');

          console.log(values);
        }
      });
    }
  }, [props.userState.user]);

  return (
    <>
      {loading ? (
        <Box
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <LoadingLogo />
        </Box>
      ) : props.userState.user ? (
        props.children
      ) : (
        <>
          <Switch>
            <Route exact path="/signin">
              <Login />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
            <Redirect from="*" to="/signin" />
          </Switch>
          <Error />
        </>
      )}
    </>
  );
};

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    userState: states.userState,
    gamesState: states.gamesState,
    gameTypesState: states.gameTypesState,
    questionTypesState: states.questionTypesState,
    questionsState: states.questionsState,
    rolesState: states.rolesState,
    questionTemplatesState: states.questionTemplatesState,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    gameGetAll: async () => {
      return await dispatch(GamesActions.gameGetAll());
    },
    gameTypeGetAll: async () => {
      return await dispatch(GameTypesActions.gameTypeGetAll());
    },
    questionTypeGetAll: async () => {
      return await dispatch(QuestionTypesActions.questionTypeGetAll());
    },
    questionGetAll: async () => {
      return await dispatch(QuestionsActions.questionGetAll());
    },
    roleGetAll: async () => {
      return await dispatch(RolesActions.roleGetAll());
    },
    questionTemplateGetAll: async () => {
      return await dispatch(QuestionTemplatesActions.questionTemplateGetAll());
    },
    relog: async () => {
      return await dispatch(relog(false));
    },
  };
};

export const AppStarting = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  RootState
>(
  mapStateToProps,
  mapDispatchToProps
)(AppStartingComponent);
