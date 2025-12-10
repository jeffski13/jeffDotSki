import { render, screen } from '@testing-library/react';
import NavigationBar from './NavigationBar';
import { getThemeManager, THEME, type DomThemeSetter, type ThemeManager, type ThemeOSMonitor, type ThemeStore } from './darkTheme';

interface ThemeStoreWithManipulations extends ThemeStore{
  themeInLocalStorageMock: string | null;
  osPreferredThemeMock: string | null;
}

const themeStoreWithManipulations: ThemeStoreWithManipulations = {
  themeInLocalStorageMock: null,
  osPreferredThemeMock: null,
  getLocalStorageTheme: function (): string | null {
    return this.themeInLocalStorageMock;
  },
  getOSPreferredTheme: function (): string | null {
    return this.osPreferredThemeMock;
  },
  setLocalStorageTheme: function (theme: string): void {
    this.themeInLocalStorageMock = theme;
  }
}

const domThemeSetterMock: DomThemeSetter = {
  setThemeInDom: function (theme: string): void {
  }
}

const themeOSMonitorMock: ThemeOSMonitor = {
  domThemeSetter: domThemeSetterMock,
  themeStore: themeStoreWithManipulations,
  setup: function (): void {
  }
}

describe('NavigationBar', () => {

  it('doesnt render the dev banner when unknown', () => {
    render(<NavigationBar themeManager={getThemeManager(themeStoreWithManipulations, domThemeSetterMock, themeOSMonitorMock)} />);
    expect(screen.queryByText(/Resume/)).toBeInTheDocument();
    //dark theme button present
    expect(screen.queryByText(/dark/)).toBeInTheDocument();
  });

  it('correct theme text on startup', () => {
    const themeStore = {...themeStoreWithManipulations};
    themeStore.themeInLocalStorageMock = 'dark';
      render(<NavigationBar themeManager={getThemeManager(themeStore, domThemeSetterMock, themeOSMonitorMock)} />);
    expect(screen.queryByText(/Resume/)).toBeInTheDocument();
    //dark theme button present
    expect(screen.queryByText(/light/)).toBeInTheDocument();
  });
});