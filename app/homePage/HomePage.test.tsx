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
    multiLangContent.es.roles.forEach(route => {
      expect(deafultRoutes).toContain(route.link);
    });
  });
});
