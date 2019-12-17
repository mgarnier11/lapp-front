import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
import { WithSnackbarProps, withSnackbar } from 'notistack';

import apiHandler from '../../../api/apiHandler';
import { Question } from '../../../api/classes/question.class';
import { Role } from '../../../api/classes/role.class';
import { QuestionType } from '../../../api/classes/questionType.class';
import { Game } from '../../../api/classes/game.class';
import {
  ServiceNames,
  ServiceEvent,
  ServiceEvents
} from '../../../api/services/baseService';

interface OwnProps {}

type Props = OwnProps & WithSnackbarProps;

interface State {
  eventsLinked: ServiceEvent[];
}

class Success extends React.Component<Props, State> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    let eventsLinkedTmp = [
      this.addEvent('logged in', ServiceNames.User),
      this.addEvent('logged out', ServiceNames.User),
      this.addEvent('registered', ServiceNames.User),
      this.addEvent(ServiceEvents.created, ServiceNames.Question),
      this.addEvent(ServiceEvents.updated, ServiceNames.Question),
      this.addEvent(ServiceEvents.removed, ServiceNames.Question),
      this.addEvent(ServiceEvents.created, ServiceNames.Role),
      this.addEvent(ServiceEvents.updated, ServiceNames.Role),
      this.addEvent(ServiceEvents.removed, ServiceNames.Role),
      this.addEvent(ServiceEvents.created, ServiceNames.QuestionType),
      this.addEvent(ServiceEvents.updated, ServiceNames.QuestionType),
      this.addEvent(ServiceEvents.removed, ServiceNames.QuestionType),
      this.addEvent(ServiceEvents.created, ServiceNames.Game),
      this.addEvent(ServiceEvents.updated, ServiceNames.Game),
      this.addEvent(ServiceEvents.removed, ServiceNames.Game)
    ];

    this.state = {
      eventsLinked: eventsLinkedTmp.filter(e => e.type !== 'none')
    };
  }

  addEvent(type: string, name: ServiceNames) {
    let service = apiHandler.service(name);

    if (service) {
      service.ownEvents.on(type, (this as any)['on' + name](type));

      return { type, name };
    }

    return { type: 'none', name };
  }

  removeEvent(type: string, name: ServiceNames) {
    let service = apiHandler.service(name);

    if (service) {
      service.ownEvents.off(type, (this as any)['on' + name](type));
    }
  }

  onQuestion(type: string) {
    return (question: Question) => {
      this.displaySnackbar(`Question succesfully ${type}`);
    };
  }

  onRole(type: string) {
    return (role: Role) => {
      this.displaySnackbar(`Role succesfully ${type}`);
    };
  }

  onQuestionType(type: string) {
    return (questionType: QuestionType) => {
      this.displaySnackbar(`Question Type succesfully ${type}`);
    };
  }

  onGame(type: string) {
    return (game: Game) => {
      this.displaySnackbar(`Game succesfully ${type}`);
    };
  }

  onUser(type: string) {
    return () => {
      this.displaySnackbar(`Succesfully ${type}`);
    };
  }

  componentWillUnmount() {
    this.state.eventsLinked.forEach(e => {
      this.removeEvent(e.type, e.name);
    });
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
