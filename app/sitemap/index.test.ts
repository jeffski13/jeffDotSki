import { es as navEs, defaultText as navDefaultText } from '../infra/NavigationBar';
import { multiLangContent } from './index';
import type { ContentPerLanguage, SitemapSection } from './index';

describe('Sitemap link text is sourced from NavigationBar', () => {
  const navEsValues = new Set(Object.values(navEs));
  const navDefaultValues = new Set(Object.values(navDefaultText));

  function assertAllTextFromNav(sections: SitemapSection[], navValues: Set<string>, lang: string) {
    sections.forEach((section) => {
      expect(navValues, `Section title "${section.title}" not found in NavigationBar ${lang} content`).toContain(section.title);
      section.links.forEach((link) => {
        expect(navValues, `Link text "${link.text}" not found in NavigationBar ${lang} content`).toContain(link.text);
      });
    });
  }

  it('Spanish (es) section titles and link text all come from NavigationBar', () => {
    const { sections } = multiLangContent.es as ContentPerLanguage;
    assertAllTextFromNav(sections, navEsValues, 'es');
  });

  it('Default (English) section titles and link text all come from NavigationBar', () => {
    const { sections } = multiLangContent.default as ContentPerLanguage;
    assertAllTextFromNav(sections, navDefaultValues, 'default');
  });
});
