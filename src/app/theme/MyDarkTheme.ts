import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { palette } from './palette';
import { MyMuiAppBar } from './components/MyMuiAppBar';
import { colors } from '@material-ui/core';
import { MyMuiFab } from './components/MyMuiFab';
import { MyMuiDrawer } from './components/MyDrawer';

export const MyDarkTheme: ThemeOptions = {
  palette: { ...palette, type: 'dark' },
  overrides: {
    MuiAppBar: {
      ...MyMuiAppBar,
      colorPrimary: {
        backgroundColor: palette.primary.main
      }
    },
    MuiAvatar: {
      colorDefault: {
        backgroundColor: palette.secondary.main,
        color: colors.common.black
      }
    },
    MuiInputBase: {
      input: {
        boxShadow: `0 0 0 100px ${colors.grey[800]} inset !important`
      }
    },
    MuiFormLabel: {
      root: {
        '&$focused': {
          color: colors.common.white
        }
      }
    },
    MuiOutlinedInput: {
      root: {
        '&$focused $notchedOutline': {
          borderColor: `${palette.secondary.main} !important`
        }
      }
    },
    MuiButton: {
      contained: {
        backgroundColor: `${colors.grey[700]} !important`,
        color: `${colors.common.white} !important`
      },
      containedPrimary: {
        backgroundColor: `${palette.primary.light} !important`,
        '&:hover': {
          backgroundColor: `${palette.primary.main} !important`
        }
      }
    },
    MuiFab: {
      ...MyMuiFab,
      root: {
        ...MyMuiFab.root,
        backgroundColor: palette.primary.light,

        '&:hover': {
          backgroundColor: `${palette.primary.main} !important`
        }
      }
    },
    MuiDrawer: {
      ...MyMuiDrawer
    },
    MuiCircularProgress: {
      colorPrimary: {
        color: palette.primary.light
      }
    }
  }
};
