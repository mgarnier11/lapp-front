import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
import { WithSnackbarProps, withSnackbar } from 'notistack';

import apiHandler from '../../../api/apiHandler';
import { EventEmitter } from 'events';
import { Question } from '../../../api/classes/question.class';

interface OwnProps {}

type Props = OwnProps & WithSnackbarProps;

interface State {}

class Success extends React.Component<Props, State> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {};

    apiHandler.questionService.featherService.on(
      'created',
      this.onQuestion('created')
    );

    this.onQuestion = this.onQuestion.bind(this);
  }

  onQuestion(type: string) {
    return (question: Question) => {
      this.displaySnackbar(`Question succesfully ${type}`);
    };
  }

  componentWillUnmount() {
    apiHandler.questionService.featherService.off(
      'created',
      this.onQuestion('created')
    );
  }

  displaySnackbar(message: string) {
    this.props.enqueueSnackbar(<span>{message}</span>, {
      autoHideDuration: 3000,
      variant: 'success',
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

  render() {
    return <></>;
  }
}

export default withSnackbar(Success);
