import { Overrides } from '@material-ui/core/styles/overrides';
import { ToggleButtonClassKey } from '@material-ui/lab/ToggleButton';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

export interface MyOverrides extends Overrides {
  MuiToggleButton?:
    | Partial<
        Record<ToggleButtonClassKey, CSSProperties | (() => CSSProperties)>
      >
    | undefined;
}
