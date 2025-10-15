import { getContentByLanguage } from './langSupport';
import type { MultiLangContent } from './langSupport';

describe('getContentByLanguage', () => {
  const esContent = { test: 'español' };
  const defaultContent = { test: 'english' };
  const multiLangContent: MultiLangContent = {
    es: esContent,
    default: defaultContent,
  };

  it('returns the english content when browser language is en', () => {
    const result = getContentByLanguage(multiLangContent, 'en');
    expect(result).toBe(defaultContent); 
  });

  it('returns the es content when browser language is es', () => {
    const result = getContentByLanguage(multiLangContent, 'es');
    expect(result).toBe(esContent); 
  });

  it('returns the default content when browser language is not supported', () => {
    const result = getContentByLanguage(multiLangContent, 'fr');
    expect(result).toBe(defaultContent); 
  });
});
