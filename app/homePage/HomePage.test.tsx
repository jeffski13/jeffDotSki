import { render, screen } from '@testing-library/react';
import HomePage, { multiLangContent, type Role } from './index';

describe('HomePage Component', () => {
  test('renders main content along with version', () => {
    render(<HomePage />);
    
    // Check that main content is still present
    expect(screen.getByText('Who Is Jeff (Jeffski) Szcinski?')).toBeInTheDocument();
    expect(screen.getByText(/SZCIN/)).toBeInTheDocument();
  });

  it('all routes are the same for english and spanish', () => {
    const deafultRoutes: string[] = [];
    multiLangContent.default.roles.forEach(route => {
      deafultRoutes.push(route.link);
    });
    const spanishRoutes: string[] = [];
    //check everything in spanish routes is in default routes
    multiLangContent.es.roles.forEach(route => {
      spanishRoutes.push(route.link);
      expect(deafultRoutes).toContain(route.link);
    });
    
    //check everything in default routes is in spanish routes
    deafultRoutes.forEach(link => {
      expect(spanishRoutes).toContain(link);
    })
  });
});
