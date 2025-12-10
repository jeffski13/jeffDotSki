const THEME_STORAGE_KEY = 'theme';

export enum THEME {
    DARK,
    LIGHT
}

const THEME_STRING_MAP = {
    DARK: 'dark',
    LIGHT: 'light',
}

/*!
* Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
* Copyright 2011-2025 The Bootstrap Authors
* Licensed under the Creative Commons Attribution 3.0 Unported License.
*/
export const updateTheme = (theme: THEME) => {
    let themeString = '';
    if(theme === THEME.LIGHT) {
        themeString = THEME_STRING_MAP.LIGHT;
    }
    else {
        themeString = THEME_STRING_MAP.DARK;
    }
    setStoredTheme(themeString);
    setTheme(themeString);
}

export const getCurrentTheme = (): THEME => {
    if(getStoredTheme() === THEME_STRING_MAP.DARK){
        return THEME.DARK;
    }
    else {
        return THEME.LIGHT;
    }
}

export const getStoredTheme = () => {
    return localStorage.getItem(THEME_STORAGE_KEY);
}

const setStoredTheme = (theme: string) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
};

const getPreferredTheme = () => {
    const storedTheme = getStoredTheme();
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

export const setupDarkMode = () => {
    const previouslyStoredTheme = getStoredTheme();
    if(!previouslyStoredTheme) {
        const preferredTheme = getPreferredTheme();
        if(!preferredTheme) {
            setTheme(THEME_STRING_MAP.LIGHT);
        }
        else {
            setTheme(preferredTheme);
        }
    }
    else {
        setTheme(previouslyStoredTheme);
    }


    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        //update when user changes os theme preference
        console.log('window.matchMedia');
        const storedTheme = getStoredTheme();
        if (storedTheme !== 'light' && storedTheme !== 'dark') {
            setTheme(getPreferredTheme());
        }
    });
}