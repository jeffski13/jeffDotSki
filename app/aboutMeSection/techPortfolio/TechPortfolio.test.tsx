import { render, screen } from '@testing-library/react';
import TechPortfolio from './index';
import { locationProviderMock } from '../PortfolioProps';

describe('TechPortfolio Component', () => {
  test('renders main content', () => {
    render(<TechPortfolio isTestEnv={true} locationProvider={locationProviderMock} />);

    // smoke test for render
    expect(screen.getByText(/Developer of/i)).toBeInTheDocument();
  });
});
