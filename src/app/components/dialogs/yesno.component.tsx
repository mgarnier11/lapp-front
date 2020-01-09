import React from 'react';
import ReactDOM from 'react-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core';
import { EventEmitter } from 'events';
//import { makeStyles } from '@material-ui/core';

interface StateProps {}

type Props = StateProps;

interface RequiredState {
  isOpen: boolean;
}

interface OptionnalState {
  title: string;
  text: string;
  acceptText: string;
  denyText: string;
}

type ComponentState = RequiredState & OptionnalState;

class YesNoComponent extends React.Component<Props, ComponentState> {
  private events: EventEmitter = new EventEmitter();

  private static defaultState: OptionnalState = {
    title: 'Are you sure ?',
    text: '',
    acceptText: 'Accept',
    denyText: 'Deny'
  };

  /**
   *
   */
  constructor(props: Props) {
    super(props);
    this.state = { ...YesNoComponent.defaultState, isOpen: false };
  }

  private handleAccept = () => {
    this.events.emit('resolve');

    this.close();
  };

  private handleDeny = () => {
    this.events.emit('reject');

    this.close();
  };

  present = (newState: Partial<OptionnalState>) => {
    if (newState) newState = { ...YesNoComponent.defaultState, ...newState };

    this.setState({
      isOpen: true,
      title: newState.title!,
      text: newState.text!,
      acceptText: newState.acceptText!,
      denyText: newState.denyText!
    });
    return new Promise((res, rej) => {
      this.events.once('resolve', () => {
        this.events.removeAllListeners('reject');

        res();
      });
      this.events.once('reject', () => {
        this.events.removeAllListeners('resolve');

        rej();
      });
    });
  };

  close = () => {
    this.setState({ isOpen: false });
  };

  render() {
    return (
      <Dialog
        open={this.state.isOpen}
        onClose={this.handleDeny}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{this.state.title}</DialogTitle>
        {this.state.text && (
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.text}
            </DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={this.handleAccept} color="primary">
            {this.state.acceptText}
          </Button>
          <Button onClick={this.handleDeny} color="primary" autoFocus>
            {this.state.denyText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
const ref = React.createRef<YesNoComponent>();

ReactDOM.render(
  <YesNoComponent ref={ref} />,
  document.getElementById('yesnoRoot')
);

export const yesNoController = ref.current;
