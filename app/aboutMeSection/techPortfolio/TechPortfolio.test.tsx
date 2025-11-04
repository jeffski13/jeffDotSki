import { render, screen } from '@testing-library/react';
import TechPortfolio from './index';

describe('TechPortfolio Component', () => {
  test('renders main content', () => {
    render(<TechPortfolio />);
    
    // smoke test for render
    expect(screen.getByText(/Developer of/i)).toBeInTheDocument();
  });
});
