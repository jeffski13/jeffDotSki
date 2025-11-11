import { render, screen } from '@testing-library/react';
import TeacherPortfolio from './index';

describe('TechPortfolio Component', () => {
  test('renders main content', () => {
    render(<TeacherPortfolio />);
    
    // smoke test for render
    expect(screen.getByText(/Teacher/i)).toBeInTheDocument();
  });
});
