
export enum THEME {
    DARK,
    LIGHT
}

const THEME_STORAGE_KEY = 'theme';
const THEME_STRING_MAP = {
    DARK: 'dark',
    LIGHT: 'light',
}

export interface ThemeStore {
    getLocalStorageTheme: () => string | null;
    getOSPreferredTheme: () => string | null;
    setLocalStorageTheme: (theme: string) => void;
}

export interface ThemeManager {
    themeStore: ThemeStore;
    getCurrentTheme: () => THEME;
    updateTheme: (theme: THEME) => void;
    setupDarkMode: () => void
}

export const themeStoreImpl: ThemeStore = {
    getLocalStorageTheme: function (): string | null {
        return localStorage.getItem(THEME_STORAGE_KEY);
    },
    getOSPreferredTheme: function (): string | null {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return THEME_STRING_MAP.DARK;
        }
        else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            return THEME_STRING_MAP.LIGHT;
        }
        else {
            return null;
        }
    },
    setLocalStorageTheme: function (theme: string): void {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
}

export const themeManagerImpl: ThemeManager = {
    themeStore: themeStoreImpl,
    getCurrentTheme: function (): THEME {
        if (getRestoreTheme(this.themeStore) === THEME_STRING_MAP.DARK) {
            return THEME.DARK;
        }
        else {
            return THEME.LIGHT;
        }
    },
    updateTheme: function (theme: THEME): void {
        let themeString = '';
        if (theme === THEME.LIGHT) {
            themeString = THEME_STRING_MAP.LIGHT;
        }
        else {
            themeString = THEME_STRING_MAP.DARK;
        }
        this.themeStore.setLocalStorageTheme(themeString);
        setTheme(themeString);
    },
    setupDarkMode: function (): void {
        const theme = getRestoreTheme(this.themeStore);
        setTheme(theme);

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            //update when user changes os theme preference
            console.log('window.matchMedia');
            const storedTheme = this.themeStore.getLocalStorageTheme();
            if (storedTheme !== 'light' && storedTheme !== 'dark') {
                setTheme(getRestoreTheme(this.themeStore));
            }
        });
    }
}

const getRestoreTheme = (themeStore: ThemeStore): string => {
    const previouslyStoredTheme = themeStore.getLocalStorageTheme();
    if (!previouslyStoredTheme) {
        const preferredTheme = themeStore.getOSPreferredTheme();
        if (!preferredTheme) {
            return THEME_STRING_MAP.LIGHT
        }
        else {
            return preferredTheme;
        }
    }
    else {
        return previouslyStoredTheme;
    }
};

const setTheme = (theme: string) => {
    if (theme === 'auto') {
        document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
    } else {
        document.documentElement.setAttribute('data-bs-theme', theme)
    }
}
