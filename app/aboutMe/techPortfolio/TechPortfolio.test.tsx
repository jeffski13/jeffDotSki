import { render, screen } from '@testing-library/react';
import TechPortfolio from './index';

describe('TechPortfolio Component', () => {
  test('renders main content', () => {
    render(<TechPortfolio />);
    
    // Check that main content is still present
    expect(screen.getByText('Developer')).toBeInTheDocument();
    
  });
});
