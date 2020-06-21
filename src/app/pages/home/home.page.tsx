import React, { useState } from 'react';
import { RouterProps, withRouter } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import {
  Tabs,
  Tab,
  Fab,
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { UserState } from '../../../store/user/types';
import { GamesState } from '../../../store/games/types';
import { TabPanel } from '../../components/utils/tabPanel.component';
import { Game } from '../../../api/classes/game.class';
import { User } from '../../../api/classes/user.class';
import { GameList } from '../../components/game/game.list.component';
import { RootState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { GamesActions } from '../../../store/games/actions';
import { connect } from 'react-redux';
import { GameActions } from '../../../store/game/actions';
import { LoadingOverlay } from '../../components/utils/loadingOverlay.component';

const useStyles = makeStyles((theme) => ({
  modalTitle: {
    padding: '8px 16px',
    paddingTop: 12,
  },
  modalContent: {
    padding: '0px 16px',
  },
  modalActions: {
    padding: '8px 16px',
    '& :first-child': {
      marginLeft: 'auto',
    },
  },
}));

interface OwnProps {}

interface DispatchProps {
  gameCreate: (game: Game) => Promise<any>;
  gameGetById: (gameId: string) => Promise<any>;
  gameGetAllLinked: (userId: string) => Promise<any>;
  gameGetByDisplayId: (displayId: string) => Promise<any>;
  gameDelete: (gameId: string) => Promise<any>;
}

interface StateProps {
  gamesState: GamesState;
  userState: UserState;
}

type Props = StateProps & OwnProps & DispatchProps & RouterProps;

interface ModalProps {
  open: boolean;
  gameName: string;
}
const HomePage: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  const { user: me } = props.userState;

  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalProps, setModalProps] = useState({
    open: false,
    gameName: '',
  } as ModalProps);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) =>
    setSelectedTab(newValue);

  const handleOnPlay = (game: Game) => {
    props.gameGetByDisplayId(game.displayId);
    props.history.push(`/games/${game.displayId}`);
  };

  const handleOnClose = () => {
    setModalProps({ ...modalProps, open: false });
  };

  const handleOnDelete = (gameId: string) => {
    props.gameDelete(gameId);
  };

  const handleCreate = async () => {
    if (modalProps.gameName.length > 0) {
      setModalProps({ ...modalProps, open: false });

      setLoading(true);

      await props.gameCreate(Game.New({ name: modalProps.gameName }));

      setLoading(false);
    }
  };

  const handleOnCreate = async () => {
    setModalProps({ open: true, gameName: '' });
  };

  const handleGameNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setModalProps({ ...modalProps, gameName: e.target.value });

  const renderUserGames = (user: User) => {
    const { games } = props.gamesState;

    let userGames: Game[] = [];
    if (games) userGames = games.filter((g) => g.creator.id === user.id);

    return (
      <GameList
        games={userGames}
        isAdmin={true}
        onPlay={handleOnPlay}
        onDelete={handleOnDelete}
      />
    );
  };

  const renderGamesUserIsIn = (user: User) => {
    const { games } = props.gamesState;

    let gamesUserIsIn: Game[] = [];
    if (games)
      gamesUserIsIn = games.filter(
        (g) => g.users.find((u) => u.id === user.id) !== undefined
      );

    return (
      <GameList games={gamesUserIsIn} isAdmin={false} onPlay={handleOnPlay} />
    );
  };

  return (
    <>
      <LoadingOverlay loading={loading} />
      <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth">
        <Tab label="Games you created" wrapped />
        <Tab label="Games you're in" wrapped />
      </Tabs>
      <TabPanel index={0} actualIndex={selectedTab}>
        {renderUserGames(me!)}
      </TabPanel>
      <TabPanel index={1} actualIndex={selectedTab}>
        {renderGamesUserIsIn(me!)}
      </TabPanel>

      <Fab
        className="floating-action-button"
        onClick={handleOnCreate}
        style={{ zIndex: 10 }}
      >
        <AddIcon />
      </Fab>

      <Dialog
        open={modalProps.open}
        onClose={handleOnClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle disableTypography className={classes.modalTitle}>
          <Typography component="h3" variant="h5" align="center">
            Create a new Game
          </Typography>
        </DialogTitle>
        <DialogContent className={classes.modalContent}>
          <TextField
            name="gameName"
            margin="normal"
            variant="outlined"
            type="text"
            fullWidth
            id="gameName"
            label="Game name"
            value={modalProps.gameName}
            onChange={handleGameNameChange}
          />
        </DialogContent>
        <DialogActions className={classes.modalActions}>
          <Button
            disabled={modalProps.gameName.length === 0}
            variant="contained"
            color="primary"
            onClick={handleCreate}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    gamesState: states.gamesState,
    userState: states.userState,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    gameCreate: async (game: Game) => {
      return await dispatch(GamesActions.gameCreate(game));
    },
    gameGetById: async (gameId: string) => {
      return await dispatch(GameActions.gameGetById(gameId));
    },
    gameGetAllLinked: async (userId: string) => {
      return await dispatch(GamesActions.gameGetAllLinked(userId));
    },
    gameGetByDisplayId: async (displayId: string) => {
      return await dispatch(GameActions.gameGetByDisplayId(displayId));
    },
    gameDelete: async (gameId: string) => {
      return await dispatch(GamesActions.gameRemove(gameId));
    },
  };
};

export const Home = withRouter(
  connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
  )(HomePage)
);
