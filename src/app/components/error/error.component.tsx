import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import CloseIcon from '@material-ui/icons/Close';

import { RootState } from '../../../store';
import { ErrorState, MyError } from '../../../store/error/types';
import { handleError } from '../../../store/error/actions';
import { IconButton } from '@material-ui/core';
import { WithSnackbarProps, withSnackbar } from 'notistack';

interface OwnProps {}

interface DispatchProps {
  handleError: (id: number) => void;
}

interface StateProps {
  errorState: ErrorState;
}

type Props = StateProps & OwnProps & DispatchProps & WithSnackbarProps;

interface State {}

class Error extends React.Component<Props, State> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  treatError = (error: MyError) => {
    if (error) {
      this.props.handleError(error.id);
    }
  };

  displaySnackbar(error: MyError) {
    if (error && !error.handled) {
      this.props.enqueueSnackbar(<span>{error.message}</span>, {
        autoHideDuration: 3000,
        variant: 'error',
        onExited: () => this.treatError(error),
        action: key => {
          return (
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={() => this.props.closeSnackbar(key)}
            >
              <CloseIcon />
            </IconButton>
          );
        }
      });
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    let prevErrors = prevProps.errorState.errors;
    let errors = this.props.errorState.errors;

    if (prevErrors.length !== errors.length) {
      let newError = errors
        .slice()
        .reverse()
        .find(e => e.handled === false);
      this.displaySnackbar(newError!);
    }
  }

  render() {
    return <></>;
  }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    errorState: states.error.error
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    handleError: async (id: number) => {
      await dispatch(handleError(id));
    }
  };
};

export default withSnackbar(
  connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
  )(Error)
);
