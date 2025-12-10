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
    showActiveTheme(themeString, true);
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

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const setTheme = (theme: string) => {
    console.log('setTheme: ', theme);
    if (theme === 'auto') {
        document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
    } else {
        document.documentElement.setAttribute('data-bs-theme', theme)
    }
}

export const showActiveTheme = (theme: string, focus = false) => {
    const themeSwitcher = document.querySelector('#bd-theme')

    if (!themeSwitcher) {
        return
    }

    const themeSwitcherText = document.querySelector('#bd-theme-text');
    const activeThemeIcon = document.querySelector('.theme-icon-active use');
    const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`);
    const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href');

    document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
        element.classList.remove('active')
        element.setAttribute('aria-pressed', 'false')
    })

    btnToActive.classList.add('active')
    btnToActive.setAttribute('aria-pressed', 'true')
    activeThemeIcon.setAttribute('href', svgOfActiveBtn)
    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
    themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)

    if (focus) {
        themeSwitcher.focus();
    }
}

export const setupDarkMode = () => {

    setTheme(getPreferredTheme());
    // setTheme('dark');
    // setTheme('light');


    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        console.log('window.matchMedia');
        const storedTheme = getStoredTheme();
        if (storedTheme !== 'light' && storedTheme !== 'dark') {
            setTheme(getPreferredTheme());
        }
    });

    window.addEventListener('DOMContentLoaded', () => {
        console.log('window.addEventListener');
        showActiveTheme(getPreferredTheme());

        document.querySelectorAll('[data-bs-theme-value]')
            .forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const theme = toggle.getAttribute('data-bs-theme-value');
                    setStoredTheme(theme);
                    setTheme(theme);
                    showActiveTheme(theme, true);
                })
            })
    });
}