import React, { FunctionComponent, useState } from 'react'; // importing FunctionComponent
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import { Game } from '../../../api/classes/game.class';
import { QuestionTypesState } from '../../../store/questionTypes/types';
import { GameTypesState } from '../../../store/gameTypes/types';
import { GamesState } from '../../../store/games/types';
import { RootState } from '../../../store';

interface OwnProps {
  game: Game;
  editable: boolean;
  onSubmit?: () => void;
}

interface DispatchProps {}

interface StateProps {
  gameTypesState: GameTypesState;
  gamesState: GamesState;
  questionTypesState: QuestionTypesState;
}

type GameFormProps = OwnProps & DispatchProps & StateProps;

const GameFormComponent: FunctionComponent<GameFormProps> = props => {
  const [maxDifficulty, setMaxDifficulty] = useState(0);
  const [maxHotLevel, setMaxHotLevel] = useState(0);
  const [name, setName] = useState('');
  const [nbTurns, setNbTurns] = useState(50);
  const [gameType, setGameType] = useState(props.gameTypesState.gameTypes![0]);
  const [questionTypes, setQuestionTypes] = useState(
    props.questionTypesState.questionTypes!
  );

  const handleMaxDifficultyChange = (e: any, value: number) =>
    setMaxDifficulty(value);

  const handleMaxHotLevelChange = (e: any, value: number) =>
    setMaxHotLevel(value);

  const handleNbTurnsChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNbTurns(parseInt(e.target.value));

  const handleGameTypeChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const { gameTypes } = props.gameTypesState;
    if (gameTypes) {
      setGameType(
        gameTypes.find(t => t.id === parseInt(e.target.value as string))!
      );
    } else console.error('Game types not loaded yet ! How did you get here ?');
  };

  const handleQuestionTypeChange = (typeId: string) => {
    const { questionTypes } = props.questionTypesState;
    const selectedTypes = [...props.game.questionTypes];

    if (questionTypes) {
      const indexToRemove = selectedTypes.findIndex(t => t.id === typeId);
      if (indexToRemove === -1)
        selectedTypes.push(questionTypes.find(t => t.id === typeId)!);
      else selectedTypes.splice(indexToRemove, 1);

      setQuestionTypes(selectedTypes);
    } else
      console.error('Question types not loaded yet ! How did you get here ?');
  };

  return <form></form>;
};

const mapStateToProps = (states: RootState): StateProps => {
  return {
    gameTypesState: states.gameTypesState,
    gamesState: states.gamesState,
    questionTypesState: states.questionTypesState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>
): DispatchProps => {
  return {};
};

export const GameForm = connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(GameFormComponent);
