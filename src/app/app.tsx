import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router';

import Header from './components/header/header.component';
//import Loading from './components/loading/loading.component';
import Login from './pages/auth/login/login.page';
import Register from './pages/auth/register/register.page';
import Home from './pages/home/home.page';
import Guard from './components/guard/guard.component';
import Footer from './components/footer/footer.component';
import Error from './components/error/error.component';
import Success from './components/success/success.component';
import Roles from './pages/roles/roles.page';
import QuestionTypes from './pages/questionTypes/question-types.page';
import Questions from './pages/questions/questions.page';
import QuestionNewComponent from './components/question/question.new.component';
import GameNotFound from './pages/games/game.notFound.page';
import GameNewComponent from './components/game/game.new.component';
import GameMiddlewareComponent from './components/game/game.middleware.component';

import { RootState } from '../store';
import { ThunkDispatch } from 'redux-thunk';
import { relog } from '../store/user/actions';
import { CssBaseline, Fab, Modal, Container } from '@material-ui/core';
import { RolesActions, roleActionsInstance } from '../store/roles/actions';
import { questionActionsInstance } from '../store/questions/actions';
import {
  questionTypeActionsInstance,
  QuestionTypesActions
} from '../store/questionTypes/actions';
import { UserState } from '../store/user/types';
import apiHandler from '../api/apiHandler';
import { Question } from '../api/classes/question.class';
import { Game, GameStatus } from '../api/classes/game.class';
import { ServiceEvents } from '../api/services/baseService';
import {
  gameTypeActionsInstance,
  GameTypesActions
} from '../store/gameTypes/actions';
import { gamesActionsInstance, GamesActions } from '../store/games/actions';
import { GameState } from '../store/game/types';
import { Helper } from '../helper';

interface OwnProps {}

interface DispatchProps {
  relog: () => void;
  roleGetAll: () => void;
  questionTypeGetAll: () => void;
  gameTypeGetAll: () => void;
  gameUpdate: (game: Game) => Promise<any>;
}

interface StateProps {
  userState: UserState;
  gameState: GameState;
}

type Props = StateProps & OwnProps & DispatchProps & RouteComponentProps;

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

    this.props.relog();
    this.props.roleGetAll();

    this.questionSuccessfullyCreated = this.questionSuccessfullyCreated.bind(
      this
    );
    this.gameSuccessfullyCreated = this.gameSuccessfullyCreated.bind(this);
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
    this.loadTypes();
    apiHandler.gameService.findGamesPerUser('5de6bcf9a23a5d40602409fb');
  }

  loadTypes() {
    this.props.questionTypeGetAll();
    this.props.gameTypeGetAll();
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
  }

  questionSuccessfullyCreated(q: Question) {
    this.closeQuestionModal();
  }

  gameSuccessfullyCreated(g: Game) {
    this.closeGameModal();
  }

  openQuestionModal = () => {
    this.setState({ questionModalOpen: true });
  };

  closeQuestionModal = () => {
    this.setState({ questionModalOpen: false });
  };

  openGameModal = () => {
    this.setState({ gameModalOpen: true });
  };

  closeGameModal = () => {
    this.setState({ gameModalOpen: false });
  };

  playingGameNext = () => {
    const { game } = this.props.gameState;

    if (game) {
      this.props.gameUpdate(Helper.clone(game, { status: GameStatus.started }));
    }
  };

  renderQuestionFAB() {
    return (
      <Fab
        variant="extended"
        className="floating-action-button"
        color="primary"
        onClick={this.openQuestionModal}
      >
        New Question
      </Fab>
    );
  }

  renderPlayingFAB() {
    const { game } = this.props.gameState;
    const isDisabled = this.props.userState.user!.id !== game!.creator.id;
    let text = 'Next';

    if (game) {
      switch (game!.status) {
        case GameStatus.created:
          text = 'Start Game';
          break;
        case GameStatus.started:
          text = 'Next Question';
          break;
        case GameStatus.finished:
          text = '';
          break;
      }
    }

    return (
      <Fab
        variant="extended"
        className="floating-action-button"
        color="primary"
        onClick={this.playingGameNext}
        disabled={isDisabled}
      >
        {text}
      </Fab>
    );
  }

  renderGameFAB() {
    return (
      <Fab
        variant="extended"
        className="floating-action-button"
        color="primary"
        onClick={this.openGameModal}
      >
        New Game
      </Fab>
    );
  }

  renderQuestionModal() {
    return (
      <Modal
        open={this.state.questionModalOpen}
        onClose={this.closeQuestionModal}
      >
        <QuestionNewComponent />
      </Modal>
    );
  }

  renderGameModal() {
    return (
      <Modal open={this.state.gameModalOpen} onClose={this.closeGameModal}>
        <GameNewComponent />
      </Modal>
    );
  }

  renderFAB() {
    const questions = /questions/;
    const game = /games\/[A-Z0-9]{5,}/;
    const { pathname } = this.props.location;

    switch (true) {
      case questions.test(pathname):
        return this.renderQuestionFAB();
      case game.test(pathname):
        if (this.props.gameState.game) return this.renderPlayingFAB();
        else return this.renderGameFAB();
      default:
        return this.renderGameFAB();
    }
  }

  render() {
    const user = this.props.userState.user;
    return (
      <React.Fragment>
        <CssBaseline />

        <Header />
        <Switch>
          <Guard minimalPermission={NaN} path="/home" redirect="/">
            <Home />
          </Guard>
          <Guard minimalPermission={0} path="/questions" redirect="/">
            <Questions />
          </Guard>
          <Guard minimalPermission={0} path="/games/:displayId" redirect="/">
            <GameMiddlewareComponent />
          </Guard>
          <Guard minimalPermission={100} path="/roles" redirect="/home">
            <Roles />
          </Guard>
          <Guard minimalPermission={100} path="/questionTypes" redirect="/home">
            <QuestionTypes />
          </Guard>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Redirect from="*" to="/home" />
        </Switch>
        <Footer />
        <Success />
        <Error />
        {user ? (
          <>
            {this.renderFAB()}
            {this.renderQuestionModal()}
            {this.renderGameModal()}
          </>
        ) : (
          <></>
        )}
      </React.Fragment>
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
    gameTypeGetAll: () => {
      dispatch(GameTypesActions.gameTypeGetAll());
    },
    questionTypeGetAll: () => {
      dispatch(QuestionTypesActions.questionTypeGetAll());
    },
    relog: async () => {
      await dispatch(relog(false));
    },
    roleGetAll: async () => {
      await dispatch(RolesActions.roleGetAll());
    },
    gameUpdate: async (game: Game) => {
      return await dispatch(GamesActions.gameUpdate(game));
    }
  };
};

export default withRouter(
  connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
