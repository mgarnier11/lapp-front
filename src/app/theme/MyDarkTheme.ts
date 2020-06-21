import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { palette } from './palette';
import { MyMuiAppBar } from './components/MyMuiAppBar';
import { colors } from '@material-ui/core';
import { MyMuiFab } from './components/MyMuiFab';
import { MyMuiExpansionPanelSummary } from './components/MyMuiExpansionPanelSummary';
import { MyMuiDrawer } from './components/MyDrawer';
import { MyOverrides } from './Overrides';

const overrides: MyOverrides = {
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
  MuiFab: {
    ...MyMuiFab,
    root: {
      ...MyMuiFab.root,
      backgroundColor: palette.primary.light,
      '&:hover': {
        backgroundColor: palette.primary.main
      },
      '@media (hover: none)': {
        backgroundColor: `${palette.primary.light} !important`
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
  },
  MuiToggleButton: {
    root: {
      '&$selected': {
        backgroundColor: palette.primary.light,
        '&:hover': {
          backgroundColor: palette.primary.main
        },
        '@media (hover: none)': {
          backgroundColor: `${palette.primary.light} !important`
        }
      }
    }
  },
  MuiButton: {
    containedPrimary: {
      backgroundColor: palette.primary.light,
      '&:hover': {
        backgroundColor: palette.primary.main
      },
      '@media (hover: none)': {
        backgroundColor: `${palette.primary.light} !important`
      }
    }
  },
  MuiExpansionPanelSummary: {
    ...MyMuiExpansionPanelSummary
  },
  MuiChip: {
    colorPrimary: {
      backgroundColor: palette.primary.light,
      '&:hover': {
        backgroundColor: palette.primary.main
      },
      '@media (hover: none)': {
        backgroundColor: `${palette.primary.light} !important`
      }
    }
  }
};

export const MyDarkTheme: ThemeOptions = {
  palette: {
    ...palette,
    type: 'dark'
  },

  overrides
};
