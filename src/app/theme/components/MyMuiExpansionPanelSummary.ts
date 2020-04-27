import { ExpansionPanelSummaryClassKey } from '@material-ui/core';
import { CreateCSSProperties } from '@material-ui/core/styles/withStyles';

export const MyMuiExpansionPanelSummary: Partial<Record<
  ExpansionPanelSummaryClassKey,
  CreateCSSProperties | (() => CreateCSSProperties)
>> = {
  content: {
    '&$expanded': {
      marginBottom: 6,
      marginTop: 6,
    },
  },
  root: {
    '&$expanded': {
      minHeight: 48,
    },
  },
};
