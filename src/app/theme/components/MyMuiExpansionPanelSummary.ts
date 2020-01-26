import {
  ExpansionPanelClassKey,
  ExpansionPanelSummaryClassKey
} from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { palette } from '../palette';

export const MyMuiExpansionPanelSummary: Partial<Record<
  ExpansionPanelSummaryClassKey,
  CSSProperties | (() => CSSProperties)
>> = {
  content: {
    '&$expanded': {
      marginBottom: 6,
      marginTop: 6
    }
  },
  root: {
    '&$expanded': {
      minHeight: 48
    }
  }
};
