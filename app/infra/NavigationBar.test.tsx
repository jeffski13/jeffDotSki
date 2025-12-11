import { fireEvent, render, screen } from '@testing-library/react';
import NavigationBar from './NavigationBar';
import { getThemeManager, THEME, type DomThemeSetter, type ThemeManager, type ThemeOSMonitor, type ThemeStore } from './darkTheme';

interface ThemeStoreWithManipulations extends ThemeStore {
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

  it('happy path render test', () => {
    render(<NavigationBar themeManager={getThemeManager(themeStoreWithManipulations, domThemeSetterMock, themeOSMonitorMock)} />);
    expect(screen.queryByText(/Resume/)).toBeInTheDocument();
    const moreButton = screen.getByText(/More/i);
    fireEvent.click(moreButton);
    //dark theme button present
    expect(screen.queryByText(/Dark Mode/)).toBeInTheDocument();
  });

  it('correct theme on startup if user previously saved theme', () => {
    const themeStore = { ...themeStoreWithManipulations };
    themeStore.themeInLocalStorageMock = 'dark';
    render(<NavigationBar themeManager={getThemeManager(themeStore, domThemeSetterMock, themeOSMonitorMock)} />);
    //dark theme button present
    const moreButton = screen.getByText(/More/i);
    fireEvent.click(moreButton);
    expect(screen.queryByText(/Light Mode/)).toBeInTheDocument();
  });

  it('correct theme on startup if user has OS preferred theme', () => {
    const themeStore = { ...themeStoreWithManipulations };
    themeStore.osPreferredThemeMock = 'dark';
    render(<NavigationBar themeManager={getThemeManager(themeStore, domThemeSetterMock, themeOSMonitorMock)} />);
    //dark theme button present
    const moreButton = screen.getByText(/More/i);
    fireEvent.click(moreButton);
    expect(screen.queryByText(/Light Mode/)).toBeInTheDocument();
  });
  
  it('mode switches with dark mode button click', () => {
    render(<NavigationBar themeManager={getThemeManager(themeStoreWithManipulations, domThemeSetterMock, themeOSMonitorMock)} />);
    const moreButton = screen.getByText(/More/i);
    fireEvent.click(moreButton);
    const darkModeButton = screen.getByText(/Dark Mode/i);
    fireEvent.click(darkModeButton);
    expect(screen.queryByText(/Light Mode/)).toBeInTheDocument();
  });
});