import React from 'react';
import { connect } from 'react-redux';
import { Switch, Redirect, withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router';

import {
  withStyles,
  WithStyles,
  StyleRules,
  createStyles,
  Theme
} from '@material-ui/core/styles';

import { RootState } from '../store';
import { ThunkDispatch } from 'redux-thunk';
import { Modal, Container, CssBaseline } from '@material-ui/core';
import { roleActionsInstance } from '../store/roles/actions';
import { questionActionsInstance } from '../store/questions/actions';
import { questionTypeActionsInstance } from '../store/questionTypes/actions';
import { UserState } from '../store/user/types';
import apiHandler from '../api/apiHandler';
import { Question } from '../api/classes/question.class';
import { Game, GameStatus } from '../api/classes/game.class';
import { ServiceEvents } from '../api/services/baseService';
import { gameTypeActionsInstance } from '../store/gameTypes/actions';
import { gamesActionsInstance, GamesActions } from '../store/games/actions';
import { GameState } from '../store/game/types';
import { Helper } from '../helper';
import { Home } from './pages/home/home.page';
import { Questions } from './pages/questions/questions.page';
import { Roles } from './pages/roles/roles.page';
import { QuestionTypes } from './pages/questionTypes/question-types.page';
import { QuestionNew } from './components/question/question.new.component';
import { GameNew } from './components/game/game.new.component';
import { Header } from './components/header/header.component';
import { Guard } from './components/guard/guard.component';
import { GameMiddleware } from './components/game/game.middleware.component';
import { Footer } from './components/footer/footer.component';
import { Success } from './components/success/success.component';
import { Error } from './components/error/error.component';
import { MyFab } from './components/fab/fab.component';
import { Role } from '../api/classes/role.class';
import { questionTemplateActionsInstance } from '../store/questionTemplates/actions';

const styles = (theme: Theme): StyleRules =>
  createStyles({
    baseContainer: {
      paddingTop: 64
    },
    [theme.breakpoints.down('xs')]: {
      baseContainer: {
        paddingLeft: 0,
        paddingRight: 0
      }
    }
  });

interface OwnProps {}

interface DispatchProps {
  gameUpdate: (game: Game) => Promise<any>;
}

interface StateProps {
  userState: UserState;
  gameState: GameState;
}

type Props = StateProps &
  OwnProps &
  DispatchProps &
  RouteComponentProps &
  WithStyles<typeof styles>;

interface State {
  questionModalOpen: boolean;
  gameModalOpen: boolean;
}

class App extends React.Component<Props, State> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      questionModalOpen: false,
      gameModalOpen: false
    };
  }

  componentDidMount() {
    apiHandler.questionService.ownEvents.on(
      ServiceEvents.created,
      this.questionSuccessfullyCreated
    );
    apiHandler.gameService.ownEvents.on(
      ServiceEvents.created,
      this.gameSuccessfullyCreated
    );

    roleActionsInstance.bindBaseEvents();
    questionActionsInstance.bindBaseEvents();
    questionTypeActionsInstance.bindBaseEvents();
    gameTypeActionsInstance.bindBaseEvents();
    gamesActionsInstance.bindBaseEvents();
    questionTemplateActionsInstance.bindBaseEvents();
  }

  componentWillUnmount() {
    apiHandler.questionService.ownEvents.off(
      ServiceEvents.created,
      this.questionSuccessfullyCreated
    );
    apiHandler.gameService.ownEvents.off(
      ServiceEvents.created,
      this.gameSuccessfullyCreated
    );

    roleActionsInstance.unbindEvents();
    questionActionsInstance.unbindEvents();
    questionTypeActionsInstance.unbindEvents();
    gameTypeActionsInstance.unbindEvents();
    gamesActionsInstance.unbindEvents();
    questionTemplateActionsInstance.unbindEvents();
  }

  questionSuccessfullyCreated = (q: Question) => {
    this.setQuestionModal(false);
  };

  gameSuccessfullyCreated = (g: Game) => {
    this.setGameModal(false);
  };

  setQuestionModal = (isOpen: boolean) => {
    this.setState({ questionModalOpen: isOpen });
  };

  setGameModal = (isOpen: boolean) => {
    this.setState({ gameModalOpen: isOpen });
  };

  playingGameNext = () => {
    const { game } = this.props.gameState;

    if (game) {
      this.props.gameUpdate(Helper.clone(game, { status: GameStatus.started }));
    }
  };

  render() {
    const user = this.props.userState.user;
    const classes = this.props.classes;

    return (
      <>
        <CssBaseline />
        <Header />
        <Container component="main" className={classes.baseContainer}>
          <Switch>
            <Guard minimalPermission={NaN} path="/home" redirect="/">
              <Home />
            </Guard>
            <Guard
              minimalPermission={0}
              path="/questions"
              redirect="/"
              idViceAllowed={false}
            >
              <Questions />
            </Guard>
            <Guard minimalPermission={0} path="/games/:displayId" redirect="/">
              <GameMiddleware />
            </Guard>
            <Guard
              minimalPermission={Role.AdminPermissionLevel}
              path="/roles"
              redirect="/home"
            >
              <Roles />
            </Guard>
            <Guard
              minimalPermission={Role.AdminPermissionLevel}
              path="/questionTypes"
              redirect="/home"
            >
              <QuestionTypes />
            </Guard>
            <Redirect from="*" to="/home" />
          </Switch>
        </Container>
        <Footer />
        <Success />
        <Error />
        {user && (
          <>
            <MyFab
              openGameModal={() => this.setGameModal(true)}
              openQuestionModal={() => this.setQuestionModal(true)}
              gameNextAction={this.playingGameNext}
            />
            <Modal
              open={this.state.questionModalOpen}
              onClose={() => this.setQuestionModal(false)}
            >
              <QuestionNew />
            </Modal>
            <Modal
              open={this.state.gameModalOpen}
              onClose={() => this.setGameModal(false)}
            >
              <GameNew />
            </Modal>
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    userState: states.userState,
    gameState: states.gameState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    gameUpdate: async (game: Game) => {
      return await dispatch(GamesActions.gameUpdate(game));
    }
  };
};

export default withRouter(
  connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(App))
);
