import * as lodash from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Tabs, Tab } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import {
  withStyles,
  WithStyles,
  StyleRules,
  createStyles,
  Theme
} from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { RouterProps } from 'react-router';

import { RootState } from '../../../store';
import { Loading } from '../../components/utils/loading.component';
import { GamesState } from '../../../store/games/types';
import { Game } from '../../../api/classes/game.class';
import { UserState } from '../../../store/user/types';
import { GamesActions } from '../../../store/games/actions';
import { GameList } from '../../components/game/game.list.component';
import { TabPanel } from '../../components/utils/tabPanel.component';
import { User } from '../../../api/classes/user.class';

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
  selectedTab: number;
}
// TODO Convert to homePage to funtionnal component
class HomePage extends React.Component<Props, ComponentState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      games: [],
      selectedTab: 0
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

  handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    this.setState({ selectedTab: newValue });
  };

  render() {
    //const classes = this.props.classes;

    const { loading } = this.props.gamesState;
    const { user: me } = this.props.userState;
    const { selectedTab } = this.state;

    return loading ? (
      this.renderLoading()
    ) : (
      <>
        <Tabs
          value={selectedTab}
          onChange={this.handleTabChange}
          variant="fullWidth"
        >
          <Tab label="Games you created" wrapped />
          <Tab label="Games you're in" wrapped />
        </Tabs>
        <TabPanel index={0} actualIndex={selectedTab}>
          {this.renderUserGames(me!)}
        </TabPanel>
        <TabPanel index={1} actualIndex={selectedTab}>
          {this.renderGamesUserIsIn(me!)}
        </TabPanel>

        {/*<Hidden smDown>
          <Grid container spacing={1}>
            <Grid item md={6}>
              {this.renderUserGames(me!, 'Games you created')}
            </Grid>
            <Divider orientation="vertical" />
            <Grid item md={6}>
              {this.renderGamesUserIsIn(me!, "Games you're in ")}
            </Grid>
          </Grid>
        </Hidden>*/}
      </>
    );
  }

  renderUserGames(user: User, title?: string) {
    const { games } = this.props.gamesState;

    let userGames: Game[] = [];
    if (games) userGames = games.filter(g => g.creator.id === user.id);

    return <GameList games={userGames} title={title} isAdmin={true} />;
  }

  renderGamesUserIsIn(user: User, title?: string) {
    const { games } = this.props.gamesState;

    let gamesUserIsIn: Game[] = [];
    if (games)
      gamesUserIsIn = games.filter(
        g => g.users.find(u => u.id === user.id) !== undefined
      );

    return <GameList games={gamesUserIsIn} title={title} isAdmin={false} />;
  }

  /*
  renderGames(games: Game[]) {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <GameList games={myGames} title="Game you created" isAdmin={true} />
        </Grid>

        <Grid item xs={12} md={6}>
          <GameList games={gamesImIn} title="Games you're in" isAdmin={false} />
        </Grid>
      </Grid>
    );
  }
  */

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
    }
  };
};

export const Home = withRouter(
  connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withSnackbar(HomePage)))
);
