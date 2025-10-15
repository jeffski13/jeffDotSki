import { render, screen } from '@testing-library/react';
import DevEnvBanner from './DevEnvBanner';

describe('Dev Banner', () => {
  it('renders the dev banner in dev', () => {
    render(<DevEnvBanner env={"development"} />);
    expect(screen.queryByText(/DEV BUILD/)).toBeInTheDocument();
  });

  it('doesnt render the dev banner in prod', () => {
    render(<DevEnvBanner env={"prod"} />);
    expect(screen.queryByText(/DEV BUILD/)).not.toBeInTheDocument();
  });

  it('doesnt render the dev banner when unknown', () => {
    render(<DevEnvBanner />);
    expect(screen.queryByText(/DEV BUILD/)).not.toBeInTheDocument();
  });
});