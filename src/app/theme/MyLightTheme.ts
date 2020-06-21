import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { palette } from './palette';
import { MyMuiAppBar } from './components/MyMuiAppBar';
import { MyMuiFab } from './components/MyMuiFab';
import { MyMuiDrawer } from './components/MyDrawer';
import { MyOverrides } from './Overrides';
import { colors } from '@material-ui/core';

const overrides: MyOverrides = {
  MuiAppBar: { ...MyMuiAppBar },
  MuiFab: {
    ...MyMuiFab,
    root: {
      ...MyMuiFab.root,
      backgroundColor: palette.primary.main,

      '&:hover ': {
        backgroundColor: `${palette.primary.light} !important`
      }
    }
  },
  MuiDrawer: {
    ...MyMuiDrawer
  },
  MuiToggleButton: {
    root: {
      '&$selected': {
        backgroundColor: palette.primary.light,
        color: colors.common.white,
        '&:hover': {
          backgroundColor: palette.primary.main
        },
        '@media (hover: none)': {
          backgroundColor: `${palette.primary.light} !important`
        }
      }
    }
  }
};

export const MyLightTheme: ThemeOptions = {
  palette: { ...palette, type: 'light' },
  overrides
};
