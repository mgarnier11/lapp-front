import React, { useState } from 'react';
import { useTheme, makeStyles, withStyles } from '@material-ui/core/styles';
import { Game, GameStatus } from '../../../api/classes/game.class';
import {
  Grid,
  useMediaQuery,
  Box,
  Typography,
  Hidden,
  Switch,
  Button,
  Drawer,
  Slider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  IconButton
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import BarChartIcon from '@material-ui/icons/BarChart';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { Helper } from '../../../helper';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../../store';
import { UserState } from '../../../store/user/types';
import { connect } from 'react-redux';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';

interface FilterGameStatus {
  key: string;
  value: GameStatus;
}

const allGameStatus: FilterGameStatus[] = Object.entries(GameStatus).map(g => {
  return { key: g[0], value: g[1] };
});

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  filterButtons: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 6
  },
  myButton: {
    paddingRight: 11,
    paddingLeft: 11
  }
}));

interface DispatchProps {}

interface OwnProps {
  games: Game[];
  onDelete?: (gameId: string) => void;
  // onUpdate?: (game: Game) => void;
  onPlay?: (game: Game) => void;
  isAdmin?: boolean;
}

interface StateProps {
  userState: UserState;
}

type Props = DispatchProps & OwnProps & StateProps;

const GameListComponent: React.FunctionComponent<Props> = props => {
  const classes = useStyles();
  const theme = useTheme();
  //const isXs = useMediaQuery(theme.breakpoints.up('xs'));
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  const [filteredGameStatus, setfilteredGameStatus] = useState(allGameStatus);

  const handleToggleGameStatus = (name: string) => {
    const newFilteredGameStatus = [...filteredGameStatus];

    let gameStatusIndex = newFilteredGameStatus.findIndex(g => g.key === name);

    if (gameStatusIndex === -1) {
      newFilteredGameStatus.push(allGameStatus.find(g => g.key === name)!);
    } else {
      newFilteredGameStatus.splice(gameStatusIndex, 1);
    }
    setfilteredGameStatus(newFilteredGameStatus);
  };

  const beforeDelete = (gameId: string) => {
    if (props.onDelete) props.onDelete(gameId);
  };

  const beforePlay = (game: Game) => {
    if (props.onPlay) props.onPlay(game);
  };

  const { games } = props;

  const getTooltipTitle = (status: GameStatus) => {
    switch (status) {
      case GameStatus.created:
        return 'Edit';
      case GameStatus.started:
        return 'Play';
      case GameStatus.finished:
        return 'Stats';
    }
  };

  const getIcon = (status: GameStatus) => {
    switch (status) {
      case GameStatus.created:
        return props.isAdmin ? <EditIcon /> : <PlayArrowIcon />;
      case GameStatus.started:
        return <PlayArrowIcon />;
      case GameStatus.finished:
        return <BarChartIcon />;
    }
  };

  const renderStatusButton = (game: Game) => {
    return (
      <Tooltip title={getTooltipTitle(game.status)}>
        <IconButton
          // className={this.props.classes.myButton}
          onClick={() => beforePlay(game)}
        >
          {getIcon(game.status)}
        </IconButton>
      </Tooltip>
    );
  };

  const renderDeleteButton = (game: Game) => {
    return (
      <Tooltip title="Delete">
        <IconButton
          // className={this.props.classes.myButton}
          onClick={() => beforeDelete(game.id)}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <Box className={classes.root}>
      <ToggleButtonGroup className={classes.filterButtons} size="small">
        {allGameStatus.map(gameStatus => (
          <ToggleButton
            key={gameStatus.key}
            selected={filteredGameStatus.includes(gameStatus)}
            onClick={() => handleToggleGameStatus(gameStatus.key)}
            // className={classes.filterButton}
            // classes={{ root: classes.filterButton }}
            value={0}
          >
            {gameStatus.value}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <TableContainer component="div">
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 1 }}>Id</TableCell>
              <TableCell>Name</TableCell>
              <Hidden xsDown>
                <TableCell>Nb Players</TableCell>
              </Hidden>

              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games
              .filter(g => filteredGameStatus.find(gs => gs.value === g.status))
              .map(game => {
                return (
                  <TableRow key={game.id}>
                    <TableCell>{game.displayId}</TableCell>
                    <TableCell>{game.name}</TableCell>
                    <Hidden xsDown>
                      <TableCell>{game.allUsers.length}</TableCell>
                    </Hidden>
                    <TableCell align="center" padding="none">
                      {renderStatusButton(game)}
                      {props.isAdmin && renderDeleteButton(game)}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    userState: states.userState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {};
};

export const GameList = connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(GameListComponent);
