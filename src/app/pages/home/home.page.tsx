import React, { useEffect, useState } from 'react';
import { Switch, Redirect, RouterProps, withRouter } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import { Container, CssBaseline, Tabs, Tab, Fab } from '@material-ui/core';
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

const useStyles = makeStyles((theme) => ({}));

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

const HomePage: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  const { user: me } = props.userState;

  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) =>
    setSelectedTab(newValue);

  const onPlay = (game: Game) => {
    props.gameGetByDisplayId(game.displayId);
    props.history.push(`/games/${game.displayId}`);
  };

  const onDelete = (gameId: string) => {
    props.gameDelete(gameId);
  };

  const onCreate = async () => {
    setLoading(true);

    const gameCreated = await props.gameCreate(Game.New({}));

    props.history.push(`/games/${gameCreated.displayId}`);
  };

  const renderUserGames = (user: User) => {
    const { games } = props.gamesState;

    let userGames: Game[] = [];
    if (games) userGames = games.filter((g) => g.creator.id === user.id);

    return (
      <GameList
        games={userGames}
        isAdmin={true}
        onPlay={onPlay}
        onDelete={onDelete}
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

    return <GameList games={gamesUserIsIn} isAdmin={false} onPlay={onPlay} />;
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
        onClick={onCreate}
        style={{ zIndex: 10 }}
      >
        <AddIcon />
      </Fab>
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
