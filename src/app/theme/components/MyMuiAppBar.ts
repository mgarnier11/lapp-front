import { AppBarClassKey } from '@material-ui/core';
import { CreateCSSProperties } from '@material-ui/core/styles/withStyles';
import { palette } from '../palette';

export const MyMuiAppBar: Partial<Record<
  AppBarClassKey,
  CreateCSSProperties | (() => CreateCSSProperties)
>> = {
  colorPrimary: {
    backgroundColor: palette.primary.light,
  },
  root: {
    '&& button': {
      color: 'white',
    },
  },
};
