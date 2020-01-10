import React, { useState, createRef } from 'react';
import {
  MuiThemeProvider,
  createMuiTheme,
  Theme
} from '@material-ui/core/styles';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

export enum ThemeTypes {
  light = 'light',
  dark = 'dark'
}

const light: ThemeOptions = {
  palette: {
    type: 'light'
  }
};
const dark: ThemeOptions = {
  palette: {
    type: 'dark'
  }
};

const Themes: { [key: string]: ThemeOptions } = {
  light: light,
  dark: dark
};

interface ComponentProps {
  children?: React.ReactNode;
}

interface ComponentState {
  selectedTheme: ThemeTypes;
}

class ThemeManager extends React.Component<ComponentProps, ComponentState> {
  /**
   *
   */
  constructor(props: ComponentProps) {
    super(props);

    this.state = {
      selectedTheme: ThemeTypes.light
    };
  }

  public toggleTheme = () => {
    this.setState({
      selectedTheme:
        this.state.selectedTheme === ThemeTypes.light
          ? ThemeTypes.dark
          : ThemeTypes.light
    });
  };

  public setTheme = (newTheme: ThemeTypes) => {
    this.setState({
      selectedTheme: newTheme
    });
  };

  public getTheme = (): ThemeTypes => {
    return this.state.selectedTheme;
  };

  render() {
    const muiTheme = createMuiTheme(Themes[this.state.selectedTheme]);

    return (
      <MuiThemeProvider theme={muiTheme}>
        {this.props.children}
      </MuiThemeProvider>
    );
  }
}

export const themeManagerRef = createRef<ThemeManager>();

export class ThemeController {
  public static setTheme = (newTheme: ThemeTypes) => {
    if (ThemeController.isInitialized())
      ThemeController.themeManager().setTheme(newTheme);
  };

  public static getTheme = (): ThemeTypes => {
    if (ThemeController.isInitialized())
      return ThemeController.themeManager().getTheme();
    else return ThemeTypes.light;
  };

  public static toggleTheme = () => {
    if (ThemeController.isInitialized())
      ThemeController.themeManager().toggleTheme();
  };

  public static isLight = (): boolean => {
    if (ThemeController.isInitialized())
      return ThemeController.themeManager().getTheme() === ThemeTypes.light;
    else return false;
  };

  public static isDark = (): boolean => {
    if (ThemeController.isInitialized())
      return ThemeController.themeManager().getTheme() === ThemeTypes.dark;
    else return false;
  };

  private static isInitialized = (): boolean => {
    return themeManagerRef.current !== null;
  };

  private static themeManager = (): ThemeManager => {
    return themeManagerRef.current!;
  };
}

export default ThemeManager;
