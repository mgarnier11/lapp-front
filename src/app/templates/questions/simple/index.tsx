import React from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { Question } from '../../../../api/classes/question.class';
import { UserState } from '../../../../store/user/types';
import { RootState } from '../../../../store';
import { TemplateProps } from '..';

interface OwnProps {}

interface DispatchProps {}

interface StateProps {
  userState: UserState;
}

type Props = StateProps & OwnProps & DispatchProps & TemplateProps;

const SimpleQuestionTemplate: React.FunctionComponent<Props> = (
  props: Props
) => {
  return <>Ceci est un test</>;
};

const mapStateToProps = (states: RootState): StateProps => {
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
