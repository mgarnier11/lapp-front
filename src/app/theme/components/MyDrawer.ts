import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { DrawerClassKey } from '@material-ui/core';

export const MyMuiDrawer: Partial<Record<
  DrawerClassKey,
  CSSProperties | (() => CSSProperties)
>> = {
  root: {}
};
