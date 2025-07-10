import { useMemo } from "react";

export interface MultiLangContent {
  es: any | null,
  default: any
}

export const getBrowserLanguage = () => {
  return useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.navigator.language.startsWith('es') ? 'es' : 'en';
    }
    return 'en';
  }, []);
}

export const getContentByLanguage = (multiLangContent: MultiLangContent, lang: String) => {
  return lang === 'es' ? multiLangContent.es : multiLangContent.default;
}