import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { FabClassKey, colors } from '@material-ui/core';
import { palette } from '../palette';

export const MyMuiFab: Partial<Record<
  FabClassKey,
  CSSProperties | (() => CSSProperties)
>> = {
  root: {
    backgroundColor: palette.primary.main,
    color: colors.common.white
  }
};
