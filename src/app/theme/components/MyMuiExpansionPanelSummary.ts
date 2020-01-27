import { ExpansionPanelSummaryClassKey } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

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
