
export enum THEME {
    DARK,
    LIGHT
}

const THEME_STORAGE_KEY = 'theme';
const THEME_STRING_MAP = {
    DARK: 'dark',
    LIGHT: 'light',
}

export const updateTheme = (theme: THEME) => {
    let themeString = '';
    if (theme === THEME.LIGHT) {
        themeString = THEME_STRING_MAP.LIGHT;
    }
    else {
        themeString = THEME_STRING_MAP.DARK;
    }
    setStoredTheme(themeString);
    setTheme(themeString);
}

export const getCurrentTheme = (): THEME => {
    if (getRestoreTheme() === THEME_STRING_MAP.DARK) {
        return THEME.DARK;
    }
    else {
        return THEME.LIGHT;
    }
}

const getLocalStorageTheme = () => {
    return localStorage.getItem(THEME_STORAGE_KEY);
}

const setStoredTheme = (theme: string) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
};

const getPreferredTheme = () => {
    const storedTheme = getLocalStorageTheme();
    if (storedTheme) {
        return storedTheme;
    }
}

const setTheme = (theme: string) => {
    console.log('setTheme: ', theme);
    if (theme === 'auto') {
        document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
    } else {
        document.documentElement.setAttribute('data-bs-theme', theme)
    }
}

const getRestoreTheme = (): string => {
    const previouslyStoredTheme = getLocalStorageTheme();
    if (!previouslyStoredTheme) {
        const preferredTheme = getPreferredTheme();
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
}
export const setupDarkMode = () => {
    const theme = getRestoreTheme();
    setTheme(theme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        //update when user changes os theme preference
        console.log('window.matchMedia');
        const storedTheme = getLocalStorageTheme();
        if (storedTheme !== 'light' && storedTheme !== 'dark') {
            setTheme(getRestoreTheme());
        }
    });
}