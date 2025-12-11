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


export interface DomThemeSetter {
    setThemeInDom: (theme: string) => void;
}

const domThemeSetterImpl: DomThemeSetter = {
    setThemeInDom: function (theme: string): void {
        if (theme === 'auto') {
            document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
        } else {
            document.documentElement.setAttribute('data-bs-theme', theme)
        }
    }
}

/**
 * call {@link setupDarkMode} on mount. 
 * Theme changes can be done through {@link updateTheme} or {@link toggleTheme}
 * 
 * @function setupDarkMode
 */
export interface ThemeManager {
    domThemeSetter: DomThemeSetter;
    themeStore: ThemeStore;
    themeOSMonitor: ThemeOSMonitor;
    setupDarkMode: () => void;
    getCurrentTheme: () => THEME;
    updateTheme: (theme: THEME) => void;
    toggleTheme: () => void;
}

export interface ThemeOSMonitor {
    domThemeSetter: DomThemeSetter;
    themeStore: ThemeStore;
    setup: () => void
}

export const themeOSMonitorImpl: ThemeOSMonitor = {
    themeStore: themeStoreImpl,
    domThemeSetter: domThemeSetterImpl,
    setup: function (): void {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            //update when user changes os theme preference
            const storedTheme = this.themeStore.getLocalStorageTheme();
            if (storedTheme !== 'light' && storedTheme !== 'dark') {
                this.domThemeSetter.setThemeInDom(getRestoreTheme(this.themeStore));
            }
        });
    }
}

export const getThemeManagerImpl = () => {
    return getThemeManager(themeStoreImpl, domThemeSetterImpl, themeOSMonitorImpl);
}

export const getThemeManager = (themeStore: ThemeStore, domThemeSetter: DomThemeSetter, themeOSMonitor: ThemeOSMonitor): ThemeManager => {

    const themeManagerImpl: ThemeManager = {
        themeStore,
        domThemeSetter,
        themeOSMonitor,
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
            this.domThemeSetter.setThemeInDom(themeString);
        },
        setupDarkMode: function (): void {
            const theme = getRestoreTheme(this.themeStore);
            this.domThemeSetter.setThemeInDom(theme);
            this.themeOSMonitor.setup();

        },
        toggleTheme: function (): void {
            const currentTheme = this.getCurrentTheme();
            let nextTheme = currentTheme === THEME.DARK ? THEME.LIGHT : THEME.DARK;
            this.updateTheme(nextTheme);
        }
    };
    return themeManagerImpl;
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