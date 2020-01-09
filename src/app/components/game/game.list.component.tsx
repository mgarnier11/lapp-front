import * as lodash from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  Typography,
  Select,
  MenuItem,
  Button,
  TextField,
  InputLabel,
  FormControl,
  Input,
  Chip,
  Checkbox,
  ListItemText,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from '@material-ui/core';
import {
  withStyles,
  WithStyles,
  createStyles,
  StyleRules,
  Theme
} from '@material-ui/core/styles';
import BarChartIcon from '@material-ui/icons/BarChart';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { RouterProps, RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';

import { RootState } from '../../../store';
import { addError } from '../../../store/errors/actions';
import { Game, GameStatus } from '../../../api/classes/game.class';
import { GameTypesState } from '../../../store/gameTypes/types';
import { GamesState } from '../../../store/games/types';
import { QuestionTypesState } from '../../../store/questionTypes/types';
import { QuestionType } from '../../../api/classes/questionType.class';
import { GameType } from '../../../api/classes/gameType.class';
import { Helper } from '../../../helper';
import { GameActions } from '../../../store/game/actions';

const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {}
  });

interface OwnProps {
  games: Game[];
  title: string;
  isAdmin?: boolean;
}

interface DispatchProps {
  gameGetByDisplayId: (displayId: string) => Promise<any>;
}

interface StateProps {
  gameTypesState: GameTypesState;
}

type Props = StateProps &
  OwnProps &
  DispatchProps &
  RouteComponentProps &
  WithStyles<typeof styles>;

interface ComponentState {
  filteredGameType: GameType;
}

class GameListComponent extends React.Component<Props, ComponentState> {
  public static defaultProps = {
    isAdmin: false
  };

  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      filteredGameType: props.gameTypesState.gameTypes![0]
    };
  }

  handleGameClick = (displayId: string) => {
    this.props.gameGetByDisplayId(displayId);
    this.props.history.push(`/games/${displayId}`);
  };

  renderStatusButton(game: Game) {
    const getIcon = (status: GameStatus) => {
      switch (status) {
        case GameStatus.created:
          return this.props.isAdmin ? (
            <EditIcon color="primary" />
          ) : (
            <PlayArrowIcon color="primary" />
          );
        case GameStatus.started:
          return <PlayArrowIcon color="primary" />;
        case GameStatus.finished:
          return <BarChartIcon color="primary" />;
      }
    };

    return (
      <IconButton onClick={() => this.handleGameClick(game.displayId)}>
        {getIcon(game.status)}
      </IconButton>
    );
  }

  render() {
    const classes = this.props.classes;

    const { title, games, isAdmin } = this.props;

    return (
      <div className={classes.root}>
        <Typography variant="h5">{title}</Typography>
        <TableContainer component="div">
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {games.map(game => {
                return (
                  <TableRow key={game.id}>
                    <TableCell>{game.displayId}</TableCell>
                    <TableCell>{game.name}</TableCell>
                    <TableCell>{this.renderStatusButton(game)}</TableCell>
                    {/*displayActions && (
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
                    )*/}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

const mapStateToProps = (states: RootState): StateProps => {
  return {
    gameTypesState: states.gameTypesState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>
): DispatchProps => {
  return {
    gameGetByDisplayId: async (displayId: string) => {
      return await dispatch(GameActions.gameGetByDisplayId(displayId));
    }
  };
};

export const GameList = withRouter(
  connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { forwardRef: true }
  )(withStyles(styles)(GameListComponent))
);
