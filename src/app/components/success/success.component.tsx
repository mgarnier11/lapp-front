import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
import { WithSnackbarProps, withSnackbar } from 'notistack';

import apiHandler from '../../../api/apiHandler';
import { Question } from '../../../api/classes/question.class';
import { Role } from '../../../api/classes/role.class';
import { QuestionType } from '../../../api/classes/questionType.class';
import { Game } from '../../../api/classes/game.class';

interface OwnProps {}

type Props = OwnProps & WithSnackbarProps;

interface State {
  eventsLinked: { type: string; name: string }[];
}

class Success extends React.Component<Props, State> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    let eventsLinkedTmp = [
      this.addEvent('created', 'Question'),
      this.addEvent('created', 'Role'),
      this.addEvent('updated', 'Role'),
      this.addEvent('removed', 'Role'),
      this.addEvent('created', 'QuestionType'),
      this.addEvent('updated', 'QuestionType'),
      this.addEvent('removed', 'QuestionType')
    ];

    this.state = {
      eventsLinked: eventsLinkedTmp.filter(e => e.type !== 'none')
    };

    this.onQuestion = this.onQuestion.bind(this);
  }

  addEvent(type: string, name: string) {
    let service = apiHandler.service(name);

    if (service) {
      service.ownEvents.on(type, (this as any)['on' + name](type));

      return { type, name };
    }

    return { type: 'none', name };
  }

  removeEvent(type: string, name: string) {
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

  componentWillUnmount() {
    /*
    apiHandler.questionService.ownEvents.off(
      'created',
      this.onQuestion('created')
    );
    */
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
