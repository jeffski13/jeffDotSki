/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import TeacherPortfolio from './index';
import { locationProviderMock } from '../../infra/portfolio/PortfolioProps';

describe('TechPortfolio Component', () => {
  test('renders main content', () => {
    render(<TeacherPortfolio locationProvider={locationProviderMock} />);
    
    // smoke test for render
    expect(screen.getByText(/Teacher/i)).toBeInTheDocument();
  });
});
