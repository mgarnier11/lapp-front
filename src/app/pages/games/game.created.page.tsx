import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  Container,
  Grid,
  TextField,
  Box,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  IconButton,
  Button,
  Checkbox,
  Modal
} from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import {
  withStyles,
  WithStyles,
  createStyles,
  StyleRules,
  Theme
} from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DeleteIcon from '@material-ui/icons/Delete';

import { RootState } from '../../../store';
import { addError } from '../../../store/errors/actions';
import { Game } from '../../../api/classes/game.class';
import { GameTypesState } from '../../../store/gameTypes/types';
import { QuestionTypesState } from '../../../store/questionTypes/types';
import { GamesActions } from '../../../store/games/actions';
import { GameState } from '../../../store/game/types';
import { Loading } from '../../components/loading/loading.component';
import GameForm from '../../components/game/game.form.component';
import DummyNewComponent from '../../components/user/dummy.new.component';
import { User, GenderTable } from '../../../api/classes/user.class';
import apiHandler from '../../../api/apiHandler';
import { DummyUser } from '../../../api/classes/dummyUser.class';
import { Helper } from '../../../helper';
import { UserState } from '../../../store/user/types';

const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {
      marginTop: theme.spacing(3)
    },
    addDummyUserButton: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    }
  });

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
  gameState: GameState;
  userState: UserState;
  questionTypesState: QuestionTypesState;
}

type Props = StateProps &
  OwnProps &
  DispatchProps &
  WithSnackbarProps &
  WithStyles<typeof styles>;

interface ComponentState {
  selectedUser: User | null;
  dummyModalOpen: boolean;
  foundUsers: User[];
}

class GameCreated extends React.Component<Props, ComponentState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedUser: null,
      dummyModalOpen: false,
      foundUsers: []
    };
  }

  openDummyModal = () => {
    this.setState({ dummyModalOpen: true });
  };

  closeDummyModal = () => {
    this.setState({ dummyModalOpen: false });
  };

  handleSubmit = (game: Game) => {
    this.props.gameUpdate(game);
  };

  addUser = async (user: User) => {
    const { game } = this.props.gameState;

    if (game) {
      await this.props.gameUpdate(
        Helper.clone(game, { users: [...game.users, user] })
      );
    }
  };

  removeUser = async (user: any) => {
    const { game } = this.props.gameState;

    if (game) {
      await this.props.gameUpdate(
        Helper.clone(game, {
          users: game.users.filter(u => u.id !== user.id)
        })
      );
    }
  };

  addDummyUser = async (dummy: DummyUser) => {
    const { game } = this.props.gameState;

    if (game) {
      await this.props.gameUpdate(
        Helper.clone(game, { dummyUsers: [...game.dummyUsers, dummy] })
      );
    }
  };

  removeDummyUser = async (dummy: any) => {
    const { game } = this.props.gameState;

    if (game) {
      await this.props.gameUpdate(
        Helper.clone(game, {
          dummyUsers: game.dummyUsers.filter(d => d.id !== dummy.id)
        })
      );
    }
  };

  handleSelectUser = (e: object, user: User) => {
    this.setState({ selectedUser: null, foundUsers: [] }, () => {
      (document.activeElement as any).blur();
    });

    this.addUser(user);
  };

  handleSearchChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const searchName = e.target.value;
    const { game } = this.props.gameState;
    apiHandler.userservice
      .findUsersByPartialName(searchName)
      .then(users => {
        this.setState({
          foundUsers: game
            ? users.filter(u => !game.users.map(gu => gu.id).includes(u.id))
            : users
        });
      })
      .catch(e => {
        this.setState({ foundUsers: [] });
      });
  };

  handleDummyUserCreate = (dummy: DummyUser) => {
    this.addDummyUser(dummy);

    this.closeDummyModal();
  };

  render() {
    const classes = this.props.classes;
    const isDisabled =
      this.props.userState.user!.id !== this.props.gameState.game!.creator.id;

    const game = this.props.gameState.game;

    if (!game) return <Loading />;
    return (
      <>
        <Container maxWidth="md" className={classes.root}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <GameForm
                game={game}
                onSubmit={this.handleSubmit}
                buttonText="Update Game"
                disabled={isDisabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                getOptionLabel={(option: User) => option.name}
                options={this.state.foundUsers}
                onChange={this.handleSelectUser}
                value={this.state.selectedUser}
                disabled={isDisabled}
                renderInput={params => (
                  <TextField
                    {...params}
                    onChange={this.handleSearchChange}
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
                onClick={this.openDummyModal}
                disabled={isDisabled}
              >
                Add a temporary user
              </Button>

              <TableContainer component="div">
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Temporary</TableCell>
                      <TableCell>User name</TableCell>
                      <TableCell align="right">Gender</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {game.allUsers.map(user => {
                      const isDummy = user.constructor.name !== User.name;
                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Checkbox
                              checked={isDummy}
                              color="primary"
                              disabled
                            />
                          </TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell align="right">
                            {GenderTable[user.gender]}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              color="primary"
                              onClick={() =>
                                isDummy
                                  ? this.removeDummyUser(user)
                                  : this.removeUser(user)
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
            </Grid>
          </Grid>
        </Container>
        <Modal open={this.state.dummyModalOpen} onClose={this.closeDummyModal}>
          <DummyNewComponent dummyUserCreate={this.handleDummyUserCreate} />
        </Modal>
      </>
    );
  }

  renderGender() {}
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    gameTypesState: states.gameTypesState,
    gameState: states.gameState,
    questionTypesState: states.questionTypesState,
    userState: states.userState
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
    }
  };
};

export default connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(withStyles(styles)(withSnackbar(GameCreated)));
