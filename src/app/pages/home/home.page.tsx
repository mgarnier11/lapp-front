import * as lodash from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  Container,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip
} from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import {
  withStyles,
  WithStyles,
  StyleRules,
  createStyles,
  Theme
} from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import { RootState } from '../../../store';
import { addError } from '../../../store/errors/actions';
import { Loading } from '../../components/loading/loading.component';
import { GamesState } from '../../../store/games/types';
import { Game } from '../../../api/classes/game.class';
import { UserState } from '../../../store/user/types';
import { GamesActions } from '../../../store/games/actions';
import { withRouter } from 'react-router-dom';
import { GameActions } from '../../../store/game/actions';
import { RouterProps } from 'react-router';
import { yesNoController } from '../../components/dialogs/yesno.component';

const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(12)
    }
  });

interface OwnProps {}

interface DispatchProps {
  gameGetAllLinked: (userId: string) => Promise<any>;
  gameRemove: (gameId: string) => Promise<any>;
  gameGetAll: () => Promise<any>;
  gameGetByDisplayId: (displayId: string) => Promise<any>;
  addError: (error: any) => void;
}

interface StateProps {
  gamesState: GamesState;
  userState: UserState;
}

type Props = StateProps &
  OwnProps &
  DispatchProps &
  WithSnackbarProps &
  RouterProps &
  WithStyles<typeof styles>;

interface ComponentState {
  games: Game[];
}

class Home extends React.Component<Props, ComponentState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      games: []
    };
  }

  reloadDatas() {
    if (!this.props.gamesState.games && !this.props.gamesState.loading) {
      this.props.gameGetAllLinked(this.props.userState.user!.id);
      //this.props.gameGetAll();
    }
  }

  componentDidMount() {
    this.reloadDatas();
  }

  componentDidUpdate() {
    this.reloadDatas();
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: ComponentState) {
    let nextGames = nextProps.gamesState.games;
    if (nextGames) {
      let prevGames = prevState.games;

      if (!Game.CompareArrays(nextGames, prevGames)) {
        return {
          games: lodash.cloneDeep(nextGames)
        };
      }
    }

    return null;
  }

  handleRemoveGameClick = (gameId: string) => {
    yesNoController!
      .present({
        title: 'Are you sure you want to delete this game ?',
        acceptText: 'Yes',
        denyText: 'No'
      })
      .then(() => {
        this.props.gameRemove(gameId);
      })
      .catch(error => {
        this.props.addError(error);
      });
  };

  handleGoToClick = (displayId: string) => {
    this.props.gameGetByDisplayId(displayId);
    this.props.history.push(`/games/${displayId}`);
  };

  render() {
    const classes = this.props.classes;

    return (
      <Container component="main" className={classes.root}>
        {this.props.gamesState.games
          ? this.renderGames(this.state.games)
          : this.renderLoading()}
      </Container>
    );
  }

  renderGames(games: Game[]) {
    const me = this.props.userState.user;
    const myGames = games.filter(g => g.creator.id === me!.id);
    const gamesImIn = games.filter(
      g => g.users.find(u => u.id === me!.id) !== undefined
    );
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          {this.renderGameTable(myGames, 'Games you created', true, true)}
        </Grid>

        <Grid item xs={12} md={6}>
          {this.renderGameTable(gamesImIn, "Games you're in", false, true)}
        </Grid>
      </Grid>
    );
  }

  renderGameTable(
    games: Game[],
    title: string,
    displayRemove?: boolean,
    displayGoTo?: boolean
  ) {
    if (!displayRemove) displayRemove = false;
    if (!displayGoTo) displayGoTo = false;
    const displayActions = displayRemove || displayGoTo;

    return (
      <>
        <Typography variant="h5">{title}</Typography>
        <TableContainer component="div">
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                {displayActions && (
                  <TableCell align="center">Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {games.map(game => {
                return (
                  <TableRow key={game.id}>
                    <TableCell>{game.displayId}</TableCell>
                    <TableCell>{game.name}</TableCell>
                    <TableCell>
                      <Chip label={game.status} />
                    </TableCell>
                    {displayActions && (
                      <TableCell align="center">
                        {displayGoTo && (
                          <IconButton
                            color="primary"
                            onClick={() => this.handleGoToClick(game.displayId)}
                          >
                            <PlayArrowIcon />
                          </IconButton>
                        )}
                        {displayRemove && (
                          <IconButton
                            color="primary"
                            onClick={() => this.handleRemoveGameClick(game.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }

  renderLoading() {
    return <Loading />;
  }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    gamesState: states.gamesState,
    userState: states.userState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    gameGetAllLinked: async (userId: string) => {
      return await dispatch(GamesActions.gameGetAllLinked(userId));
    },
    gameRemove: async (gameId: string) => {
      return await dispatch(GamesActions.gameRemove(gameId));
    },
    gameGetAll: async () => {
      return await dispatch(GamesActions.gameGetAll());
    },
    gameGetByDisplayId: async (displayId: string) => {
      return await dispatch(GameActions.gameGetByDisplayId(displayId));
    },
    addError: async (error: any) => {
      await dispatch(addError(error));
    }
  };
};

export default withRouter(
  connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withSnackbar(Home)))
);
