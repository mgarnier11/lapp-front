import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  CardActions
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { QuestionType } from '../../../api/classes/questionType.class';

const useStyles = makeStyles(theme => ({
  cardContent: {
    paddingTop: '0 !important'
  }
}));

interface OwnProps {
  questionType: QuestionType;
  onDelete?: (questionTypeId: string) => void;
  onUpdate?: (questionType: QuestionType) => void;
}

type Props = OwnProps;

const QuestionTypeItemComponent: React.FunctionComponent<Props> = props => {
  const classes = useStyles();

  const { questionType } = props;

  const handleEdit = () => props.onUpdate && props.onUpdate(questionType);

  const handleDelete = () => props.onDelete && props.onDelete(questionType.id);

  return (
    <Card>
      <CardHeader
        title={questionType.name}
        subheader={questionType.template.name}
      />
      <CardContent className={classes.cardContent}>
        {questionType.description}
      </CardContent>
      {(props.onDelete || props.onUpdate) && (
        <CardActions>
          {props.onUpdate && (
            <IconButton aria-label="edit" onClick={handleEdit}>
              <EditIcon />
            </IconButton>
          )}
          {props.onDelete && (
            <IconButton
              aria-label="delete"
              onClick={handleDelete}
              style={{ marginLeft: 'auto' }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export const QuestionTypeItem = QuestionTypeItemComponent;
