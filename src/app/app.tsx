import React, { useEffect } from 'react';
import { Switch, Redirect } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import { Container, CssBaseline } from '@material-ui/core';
import Webcam from 'react-webcam';

import { roleActionsInstance } from '../store/roles/actions';
import { questionActionsInstance } from '../store/questions/actions';
import { questionTypeActionsInstance } from '../store/questionTypes/actions';
import { gameTypeActionsInstance } from '../store/gameTypes/actions';
import { gamesActionsInstance } from '../store/games/actions';
import { Home } from './pages/home/home.page';
import { Questions } from './pages/questions/questions.page';
import { Roles } from './pages/roles/roles.page';
import { Header } from './components/header/header.component';
import { Guard } from './components/guard/guard.component';
import { GameMiddleware } from './components/game/game.middleware.component';
import { Footer } from './components/footer/footer.component';
import { Success } from './components/success/success.component';
import { Error } from './components/error/error.component';
import { questionTemplateActionsInstance } from '../store/questionTemplates/actions';
import { QuestionTemplates } from './pages/questionTemplates/questionTemplates.page';
import { Role } from '../api/classes/role.class';
import { QuestionTypes } from './pages/questionTypes/questionTypes.page';

const useStyles = makeStyles((theme) => ({
  baseContainer: {
    paddingTop: 64,
  },
  [theme.breakpoints.down('xs')]: {
    baseContainer: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
}));

interface Props {}

const App: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  useEffect(() => {
    roleActionsInstance.bindBaseEvents();
    questionActionsInstance.bindBaseEvents();
    questionTypeActionsInstance.bindBaseEvents();
    gameTypeActionsInstance.bindBaseEvents();
    gamesActionsInstance.bindBaseEvents();
    questionTemplateActionsInstance.bindBaseEvents();

    return () => {
      roleActionsInstance.unbindEvents();
      questionActionsInstance.unbindEvents();
      questionTypeActionsInstance.unbindEvents();
      gameTypeActionsInstance.unbindEvents();
      gamesActionsInstance.unbindEvents();
      questionTemplateActionsInstance.unbindEvents();
    };
  }, []);

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
            path="/questionTemplates"
            redirect="/home"
          >
            <QuestionTemplates />
          </Guard>
          <Guard
            minimalPermission={Role.AdminPermissionLevel}
            path="/questionTypes"
            redirect="/home"
          >
            <QuestionTypes />
          </Guard>
          <Guard
            minimalPermission={Role.AdminPermissionLevel}
            path="/test"
            redirect="/home"
          >
            <WebcamCapture />
          </Guard>
          <Redirect from="*" to="/home" />
        </Switch>
      </Container>
      <Footer />
      <Success />
      <Error />
    </>
  );
};

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'user',
};

const WebcamCapture = () => {
  const webcamRef = React.useRef(null) as any;

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc);
  }, [webcamRef]);

  return (
    <>
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
      />
      <button onClick={capture}>Capture photo</button>
    </>
  );
};

export default App;
