import { render, screen } from '@testing-library/react';
import NavigationBar from './NavigationBar';
import type { THEME, ThemeManager, ThemeStore } from './darkTheme';

const getThemeStoreMock = (): ThemeStore => {

  const themeStoreMock: ThemeStore = {
    getLocalStorageTheme: function (): string | null {
      return themeInLocalStorageMock;
    },
    getOSPreferredTheme: function (): string | null {
      return osPreferredThemeMock;
    },
    setLocalStorageTheme: function (theme: string): void {
      themeInLocalStorageMock = theme;
    }
  };
  
  let themeInLocalStorageMock: string | null = null;
  let osPreferredThemeMock: string | null = null;
  
  themeStoreMock.setOSPreferredTheme = (theme: string): string | null {
    osPreferredThemeMock = theme;
  };

  return themeStoreMock;
}

const themeManagerMock: ThemeManager = {
  themeStore: getThemeStoreMock(),
  getCurrentTheme: function (): THEME {
    return this.themeStore.getLocalStorageTheme()
  },
  updateTheme: function (theme: THEME): void {
    throw new Error('Function not implemented.');
  },
  setupDarkMode: function (): void {
    throw new Error('Function not implemented.');
  }
}

describe('NavigationBar', () => {

  it('doesnt render the dev banner when unknown', () => {
    render(<NavigationBar themeManager={getThemeStoreMock()} />);
    expect(screen.queryByText(/Resume/)).toBeInTheDocument();
  });

  

});