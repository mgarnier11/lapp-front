import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Container, Card, CardContent, CardHeader } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import {
  withStyles,
  WithStyles,
  createStyles,
  StyleRules,
  Theme
} from '@material-ui/core/styles';

import { RootState } from '../../../store';
import { GamesActions } from '../../../store/games/actions';
import { addError } from '../../../store/errors/actions';
import { Game } from '../../../api/classes/game.class';
import { GameForm } from './game.form.component';

const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'fit-content',
      outline: 'none',
      maxWidth: '400px'
    },
    card: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      textAlign: 'center'
    },
    cardContent: {
      padding: '0',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    }
  });

interface OwnProps {}

interface DispatchProps {
  gameCreate: (game: Partial<Game>) => Promise<any>;
  addError: (error: any) => void;
}

interface StateProps {}

type Props = StateProps &
  OwnProps &
  DispatchProps &
  WithSnackbarProps &
  WithStyles<typeof styles>;

interface ComponentState {}

class GameNewComponent extends React.Component<Props, ComponentState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  handleSubmit = (game: Game) => {
    this.props.gameCreate(game);
  };

  render() {
    const classes = this.props.classes;

    return (
      <Container component="main" className={classes.root} tabIndex={-1}>
        <Card className={classes.card} raised={true}>
          <CardHeader title="Create a new game" />
          <CardContent className={classes.cardContent}>
            <GameForm
              game={Game.New({ nbTurns: 10 })}
              onSubmit={this.handleSubmit}
              buttonText="Create Game"
              editable={false}
            />
          </CardContent>
        </Card>
      </Container>
    );
  }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {};
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    gameCreate: async (newGame: Partial<Game>) => {
      return await dispatch(GamesActions.gameCreate(newGame));
    },
    addError: async (error: any) => {
      await dispatch(addError(error));
    }
  };
};

export const GameNew = connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(withStyles(styles)(withSnackbar(GameNewComponent)));
