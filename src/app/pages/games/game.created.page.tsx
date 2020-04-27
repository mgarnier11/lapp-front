import React, { useState } from 'react';
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
  gameUpdate: (game: Game) => Promise<any>;
  gameRemove: (gameId: string) => Promise<any>;
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

interface ComponentState {
  selectedUser: User | null;
  dummyModalOpen: boolean;
  foundUsers: User[];
}

const GameCreatedPage: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  const [dummyModalOpen, setDummyModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [foundUsers, setFoundUsers] = useState<User[]>([]);
  const [game, setGame] = useState(
    Helper.clone<Game>(props.gameState.game!, {})
  );

  const isDisabled =
    props.userState.user!.id !== props.gameState.game!.creator.id ||
    props.gamesState.loading;
  const canStartGame = game.allUsers.length > 1 || !isDisabled;

  const handleStepChange = (newStep: number) =>
    newStep >= 0 && newStep <= steps.length && setActiveStep(newStep);

  const handleNext = (game: Game) => {
    setGame(game);

    handleStepChange(activeStep + 1);
  };

  const startGame = async () => {
    const startedGame = Helper.clone(game, {
      status: GameStatus.started,
      scores: game.allUsers.map((u) => {
        return Score.New({ score: 0, userId: u.id });
      }),
    });

    await props.gameUpdate(startedGame);

    apiHandler.gameIo.startGame(startedGame.id);
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
        disabled={!canStartGame}
        onClick={startGame}
      >
        Start game
      </Button>
    </div>,
  ];

  return (
    <>
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
};

// // TODO Convert to gameCreatedPage to funtionnal component
// class GameCreatedPage extends React.Component<Props, ComponentState> {
//   /**
//    *
//    */
//   constructor(props: Props) {
//     super(props);

//     this.state = {
//       selectedUser: null,
//       dummyModalOpen: false,
//       foundUsers: [],
//     };
//   }

//   openDummyModal = () => {
//     this.setState({ dummyModalOpen: true });
//   };

//   closeDummyModal = () => {
//     this.setState({ dummyModalOpen: false });
//   };

//   next = (game: Game) => {
//     this.props.gameUpdate(game);
//   };

//   addUser = async (user: User) => {
//     const { game } = this.props.gameState;

//     if (game) {
//       await this.props.gameUpdate(
//         Helper.clone(game, { users: [...game.users, user] })
//       );
//     }
//   };

//   removeUser = async (user: any) => {
//     const { game } = this.props.gameState;

//     if (game) {
//       await this.props.gameUpdate(
//         Helper.clone(game, {
//           users: game.users.filter((u) => u.id !== user.id),
//         })
//       );
//     }
//   };

//   addDummyUser = async (dummy: DummyUser) => {
//     const { game } = this.props.gameState;

//     if (game) {
//       await this.props.gameUpdate(
//         Helper.clone(game, { dummyUsers: [...game.dummyUsers, dummy] })
//       );
//     }
//   };

//   removeDummyUser = async (dummy: any) => {
//     const { game } = this.props.gameState;

//     if (game) {
//       await this.props.gameUpdate(
//         Helper.clone(game, {
//           dummyUsers: game.dummyUsers.filter((d) => d.id !== dummy.id),
//         })
//       );
//     }
//   };

//   handleSelectUser = (e: React.ChangeEvent<any>, user: User | null) => {
//     this.setState({ selectedUser: null, foundUsers: [] }, () => {
//       (document.activeElement as any).blur();
//     });

//     if (user != null) this.addUser(user);
//   };

//   handleSearchChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const searchName = e.target.value;
//     const { game } = this.props.gameState;
//     apiHandler.userservice
//       .findUsersByPartialName(searchName)
//       .then((users) => {
//         this.setState({
//           foundUsers: game
//             ? users.filter((u) => !game.users.map((gu) => gu.id).includes(u.id))
//             : users,
//         });
//       })
//       .catch((e) => {
//         this.setState({ foundUsers: [] });
//       });
//   };

//   handleDummyUserCreate = (dummy: DummyUser) => {
//     this.addDummyUser(dummy);

//     this.closeDummyModal();
//   };

//   render() {
//     const classes = this.props.classes;
//     const isDisabled =
//       this.props.userState.user!.id !== this.props.gameState.game!.creator.id ||
//       this.props.gamesState.loading;

//     const game = this.props.gameState.game;

//     if (!game) return <Loading />;
//     return (
//       <>
//         <Container maxWidth="md" className={classes.root}>
//           <Grid container spacing={3}>
//             {/* <Grid item xs={12} md={6}>
//               <GameForm
//                 game={game}
//                 onSubmit={this.handleSubmit}
//                 editable
//                 disabled={isDisabled}
//                 acceptButtonText="Next"
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Autocomplete
//                 getOptionLabel={(option: User) => option.name}
//                 options={this.state.foundUsers}
//                 onChange={this.handleSelectUser}
//                 value={this.state.selectedUser}
//                 disabled={isDisabled}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     onChange={this.handleSearchChange}
//                     label="Search an existing user"
//                     variant="outlined"
//                     fullWidth
//                   />
//                 )}
//               />
//               <Button
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 className={classes.addDummyUserButton}
//                 onClick={this.openDummyModal}
//                 disabled={isDisabled}
//               >
//                 Add a temporary user
//               </Button>

//               <TableContainer component="div">
//                 <Table size="small" stickyHeader>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Type</TableCell>
//                       <TableCell>User name</TableCell>
//                       <TableCell align="right">Gender</TableCell>
//                       <TableCell align="right">Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {game.allUsers.map((user) => {
//                       const isDummy = user instanceof DummyUser; //isUUID.v1(user.id);
//                       return (
//                         <TableRow key={user.id}>
//                           <TableCell>
//                             {isDummy ? (
//                               <Tooltip title="Temporary user">
//                                 <HourglassEmptyIcon />
//                               </Tooltip>
//                             ) : (
//                               <Tooltip title="Registered user">
//                                 <PersonIcon />
//                               </Tooltip>
//                             )}
//                           </TableCell>
//                           <TableCell>{user.name}</TableCell>
//                           <TableCell align="right">
//                             {GenderTable[user.gender]}
//                           </TableCell>
//                           <TableCell align="right">
//                             <IconButton
//                               onClick={() =>
//                                 isDummy
//                                   ? this.removeDummyUser(user)
//                                   : this.removeUser(user)
//                               }
//                               disabled={isDisabled}
//                             >
//                               <DeleteIcon />
//                             </IconButton>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//               {this.props.gamesState.loading && <Loading />}
//               </Grid>*/}
//           </Grid>
//         </Container>
//         <Modal open={this.state.dummyModalOpen} onClose={this.closeDummyModal}>
//           <DummyUserNew dummyUserCreate={this.handleDummyUserCreate} />
//         </Modal>
//       </>
//     );
//   }
// }

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
    gameUpdate: async (game: Game) => {
      return await dispatch(GamesActions.gameUpdate(game));
    },
    gameRemove: async (gameId: string) => {
      return await dispatch(GamesActions.gameRemove(gameId));
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
