import { render, screen } from '@testing-library/react';
import TeacherPortfolio from './index';
import { mockLocationProvider } from '../PortfolioProps';

describe('TechPortfolio Component', () => {
  test('renders main content', () => {
    render(<TeacherPortfolio isTestEnv={true} locationProvider={mockLocationProvider} />);
    
    // smoke test for render
    expect(screen.getByText(/Teacher/i)).toBeInTheDocument();
  });
});
