import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { palette } from './palette';
import { MyMuiAppBar } from './components/MyMuiAppBar';
import { MyMuiFab } from './components/MyMuiFab';
import { MyMuiDrawer } from './components/MyDrawer';

export const MyLightTheme: ThemeOptions = {
  palette: { ...palette, type: 'light' },
  overrides: {
    MuiAppBar: { ...MyMuiAppBar },
    MuiFab: { ...MyMuiFab },
    MuiDrawer: {
      ...MyMuiDrawer
    }
  }
};
