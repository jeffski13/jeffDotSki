import { render, screen } from '@testing-library/react';
import DevEnvBanner from './DevEnvBanner';
import { ENV } from './env';

describe('Dev Banner', () => {
  it('renders the dev banner in dev', () => {
    render(<DevEnvBanner env={ENV.DEV} />);
    expect(screen.queryByText(/DEV BUILD/)).toBeInTheDocument();
  });

  it('doesnt render the dev banner in prod', () => {
    render(<DevEnvBanner env={ENV.PROD} />);
    expect(screen.queryByText(/DEV BUILD/)).not.toBeInTheDocument();
  });

  it('doesnt render the dev banner when unknown', () => {
    render(<DevEnvBanner />);
    expect(screen.queryByText(/DEV BUILD/)).not.toBeInTheDocument();
  });
});