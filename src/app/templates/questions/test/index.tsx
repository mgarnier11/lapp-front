import React from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { Question } from '../../../../api/classes/question.class';
import { UserState } from '../../../../store/user/types';
import { RootState } from '../../../../store';

interface OwnProps {
  question: Question;
  onAccept?: (question: Question) => void;
  onDeny?: (question: Question) => void;
}

interface DispatchProps {}

interface StateProps {
  userState: UserState;
}

type Props = StateProps & OwnProps & DispatchProps;

const SimpleQuestionTemplate: React.FunctionComponent<Props> = (
  props: Props
) => {
  return <>Ceci est le 2eme test</>;
};

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return { userState: states.userState };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {};
};

export default connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(SimpleQuestionTemplate);
