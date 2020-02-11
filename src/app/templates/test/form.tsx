import React from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import {
  TextField,
  Grid,
  Typography,
  Box,
  makeStyles
} from '@material-ui/core';

import Rating from '@material-ui/lab/Rating';
import FavoriteIcon from '@material-ui/icons/Favorite';

import { UserState } from '../../../store/user/types';
import { RootState } from '../../../store';
import { TemplateFormProps } from '../templateForm';
import { OutlinedDiv } from '../../components/utils/outlinedDiv.component';
import { UserItem } from '../../components/user/user.item.component';

const useStyles = makeStyles(theme => ({
  ratingsGrid: {
    width: 'calc(100% + 16px)',
    marginLeft: -8,
    textAlign: 'center'
  },
  hotLevelRating: {
    color: '#FD6C9E'
  }
}));

interface OtherProps {}

interface DispatchProps {}

interface StateProps {
  userState: UserState;
}

type Props = StateProps & OtherProps & DispatchProps & TemplateFormProps;

const SimpleQuestionTemplate: React.FunctionComponent<Props> = (
  props: Props
) => {
  const classes = useStyles();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    props.editable && props.formProps.setText(e.target.value);

  const handleDifficultyChange = (e: any, value: number) =>
    props.editable && props.formProps.setDifficulty(value);

  const handleHotLevelChange = (e: any, value: number) =>
    props.editable && props.formProps.setHotLevel(value);

  return <>This is a test</>;
};

const mapStateToProps = (states: RootState): StateProps => {
  return {
    userState: states.userState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OtherProps
): DispatchProps => {
  return {};
};

export default connect<StateProps, DispatchProps, OtherProps, RootState>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(SimpleQuestionTemplate);
