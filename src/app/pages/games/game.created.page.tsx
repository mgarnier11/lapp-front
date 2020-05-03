import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  Container,
  Grid,
  TextField,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  IconButton,
  Button,
  Modal,
  Tooltip,
  Stepper,
  StepLabel,
  Step,
  MobileStepper,
} from '@material-ui/core';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import {
  withStyles,
  WithStyles,
  createStyles,
  StyleRules,
  Theme,
  makeStyles,
} from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DeleteIcon from '@material-ui/icons/Delete';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import PersonIcon from '@material-ui/icons/Person';
import SwipeableViews from 'react-swipeable-views';

import { RootState } from '../../../store';
import { addError } from '../../../store/errors/actions';
import { Game, GameStatus } from '../../../api/classes/game.class';
import { GameTypesState } from '../../../store/gameTypes/types';
import { QuestionTypesState } from '../../../store/questionTypes/types';
import { GamesActions } from '../../../store/games/actions';
import { GameState } from '../../../store/game/types';
import { Loading } from '../../components/utils/loading.component';
import { User, GenderTable } from '../../../api/classes/user.class';
import apiHandler from '../../../api/apiHandler';
import { DummyUser } from '../../../api/classes/dummyUser.class';
import { Helper } from '../../../helper';
import { UserState } from '../../../store/user/types';
import { GamesState } from '../../../store/games/types';
import { GameForm } from '../../components/game/game.form.component';
import { DummyUserNew } from '../../components/user/dummy.new.component';
import { LoadingOverlay } from '../../components/utils/loadingOverlay.component';
import { Score } from '../../../api/classes/score.class';
import { GameActions } from '../../../store/game/actions';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
  },
  addDummyUserButton: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  viewContainer: {
    padding: theme.spacing(2),
  },
  selectUserContainer: {
    height: 490,
  },
  tableContainer: {
    paddingBottom: theme.spacing(1),
  },
}));

interface OwnProps {
  displayId?: string;
}

interface DispatchProps {
  gameUpdate: (game: Game, hideSuccess?: boolean) => Promise<any>;
  gameRemove: (gameId: string) => Promise<any>;
  gameStartLoading: () => void;
  addError: (error: any) => void;
}

interface StateProps {
  gameTypesState: GameTypesState;
  gamesState: GamesState;
  gameState: GameState;
  userState: UserState;
  questionTypesState: QuestionTypesState;
}

type Props = StateProps & OwnProps & DispatchProps;

const GameCreatedPage: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  const [dummyModalOpen, setDummyModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [foundUsers, setFoundUsers] = useState<User[]>([]);
  const [game, setGame] = useState(
    Helper.clone<Game>(props.gameState.game!, {})
  );
  const [gameStarting, setGameStarting] = useState(false);

  const isDisabled =
    props.userState.user!.id !== props.gameState.game!.creator.id ||
    props.gamesState.loading;
  const cantStartGame = game.allUsers.length === 0 || isDisabled;

  useEffect(() => {
    apiHandler.gameIo.joinGame(game.id);

    apiHandler.gameIo.onceGameLoading((isLoading: boolean) => {
      if (isLoading) {
        props.gameStartLoading();
      }
    });

    return () => {
      apiHandler.gameIo.leaveGame(game.id);
    };
  }, []);

  const handleStepChange = (newStep: number) =>
    newStep >= 0 && newStep <= steps.length && setActiveStep(newStep);

  const handleNext = (game: Game) => {
    setGame(game);

    handleStepChange(activeStep + 1);
  };

  const startGame = async () => {
    // TODO : do this server side

    // const startedGame = Helper.clone(game, {
    //   status: GameStatus.started,
    //   scores: game.allUsers.map((u) => {
    //     return Score.New({ score: 0, userId: u.id });
    //   }),
    // });

    setGameStarting(true);

    await props.gameUpdate(game, true);

    apiHandler.gameIo.startGame(game.id);
  };

  const openDummyModal = () => setDummyModalOpen(true);
  const closeDummyModal = () => setDummyModalOpen(false);

  const handleSelectUser = (e: React.ChangeEvent<any>, user: User | null) => {
    setFoundUsers([]);
    setSelectedUser(undefined);

    (document.activeElement as any).blur();

    if (user != null) addUser(user);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const searchName = e.target.value;
    apiHandler.userservice
      .findUsersByPartialName(searchName)
      .then((users) => {
        setFoundUsers(
          game
            ? users.filter((u) => !game.users.map((gu) => gu.id).includes(u.id))
            : users
        );
      })
      .catch((e) => {
        setFoundUsers([]);
      });
  };

  const addUser = async (user: User) => {
    setGame(Helper.clone(game, { users: [...game.users, user] }));
  };

  const removeUser = async (user: any) => {
    setGame(
      Helper.clone(game, { users: game.users.filter((u) => u.id !== user.id) })
    );
  };

  const addDummyUser = async (dummy: DummyUser) => {
    setGame(Helper.clone(game, { dummyUsers: [...game.dummyUsers, dummy] }));

    closeDummyModal();
  };

  const removeDummyUser = async (dummy: any) => {
    setGame(
      Helper.clone(game, {
        dummyUsers: game.dummyUsers.filter((d) => d.id !== dummy.id),
      })
    );
  };

  const steps = [
    <GameForm
      game={game}
      onSubmit={handleNext}
      editable
      acceptButtonText="Next"
      disabled={isDisabled}
    />,
    <div>
      <Autocomplete
        getOptionLabel={(option: User) => option.name}
        options={foundUsers}
        onChange={handleSelectUser}
        value={selectedUser}
        disabled={isDisabled}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={handleSearchChange}
            label="Search an existing user"
            variant="outlined"
            fullWidth
          />
        )}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        className={classes.addDummyUserButton}
        onClick={openDummyModal}
        disabled={isDisabled}
      >
        Add a temporary user
      </Button>

      <TableContainer component="div" className={classes.tableContainer}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>User name</TableCell>
              <TableCell align="right">Gender</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {game.allUsers.map((user) => {
              const isDummy = user instanceof DummyUser; //isUUID.v1(user.id);
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    {isDummy ? (
                      <Tooltip title="Temporary user">
                        <HourglassEmptyIcon />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Registered user">
                        <PersonIcon />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell align="right">
                    {GenderTable[user.gender]}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() =>
                        isDummy ? removeDummyUser(user) : removeUser(user)
                      }
                      disabled={isDisabled}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        fullWidth
        color="primary"
        variant="contained"
        disabled={cantStartGame}
        onClick={startGame}
      >
        Start game
      </Button>
    </div>,
  ];

  if (props.gameState.loading) {
    return <Loading />;
  } else {
    return (
      <>
        <LoadingOverlay loading={gameStarting} />
        <Container maxWidth="md" className={classes.root}>
          <SwipeableViews index={activeStep} disabled>
            {steps.map((step, index) => {
              return (
                <div className={classes.viewContainer} key={index}>
                  {step}
                </div>
              );
            })}
          </SwipeableViews>
        </Container>
        <Modal open={dummyModalOpen} onClose={closeDummyModal}>
          <DummyUserNew dummyUserCreate={addDummyUser} />
        </Modal>
      </>
    );
  }
};

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    gameTypesState: states.gameTypesState,
    gamesState: states.gamesState,
    gameState: states.gameState,
    questionTypesState: states.questionTypesState,
    userState: states.userState,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    gameUpdate: async (game: Game, hideSuccess?: boolean) => {
      return await dispatch(GamesActions.gameUpdate(game, hideSuccess));
    },
    gameRemove: async (gameId: string) => {
      return await dispatch(GamesActions.gameRemove(gameId));
    },
    gameStartLoading: () => {
      dispatch(GameActions.gameStartLoading());
    },
    addError: async (error: any) => {
      await dispatch(addError(error));
    },
  };
};

export const GameCreated = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  RootState
>(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
  GameCreatedPage
);
