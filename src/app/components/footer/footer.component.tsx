import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../../store';
import { useStyle } from '../useStyle.hoc';
import { styles } from './footer.component.style';
import { GlobalState } from '../../../store/global/types';
import { LinearProgress } from '@material-ui/core';

interface OwnProps {}

interface DispatchProps {}

interface StateProps {
  globalState: GlobalState;
}

type Props = StateProps & OwnProps & DispatchProps;

const Footer: React.FunctionComponent<Props> = (props: Props) => {
  let { loading } = props.globalState;
  console.log(loading);

  if (!loading) return <></>;
  else return <LinearProgress />;
};

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    globalState: states.global.global
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {};
};

export default useStyle(
  connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
  )(Footer),
  styles
);
