import { render, screen } from '@testing-library/react';
import TitlePage from './index';

describe('TitlePage Component', () => {
  test('renders main content along with version', () => {
    render(<TitlePage />);
    
    // Check that main content is still present
    expect(screen.getByText('Who Is Jeff (Jeffski) Szcinski?')).toBeInTheDocument();
    expect(screen.getByText(/SZCIN/)).toBeInTheDocument();
  });
});
