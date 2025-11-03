import { render, screen } from '@testing-library/react';
import HomePage from './index';

describe('HomePage Component', () => {
  test('renders main content along with version', () => {
    render(<HomePage />);
    
    // Check that main content is still present
    expect(screen.getByText('Who Is Jeff (Jeffski) Szcinski?')).toBeInTheDocument();
    expect(screen.getByText(/SZCIN/)).toBeInTheDocument();
  });
});
