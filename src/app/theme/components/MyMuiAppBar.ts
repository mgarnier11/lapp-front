import { AppBarClassKey } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { palette } from '../palette';

export const MyMuiAppBar: Partial<Record<
  AppBarClassKey,
  CSSProperties | (() => CSSProperties)
>> = {
  colorPrimary: {
    backgroundColor: palette.primary.light
  },
  root: {
    '&& button': {
      color: 'white'
    }
  }
};
