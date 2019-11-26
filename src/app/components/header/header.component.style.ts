import { Theme } from '@material-ui/core/styles';

export const styles = (theme: Theme) => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  userName: {
    marginRight: '5px'
  },
  logButton: {
    color: 'inherit',
    textDecoration: 'none'
  }
});
