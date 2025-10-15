import { render, screen } from '@testing-library/react';
import DevBanner from './DevBanner';

describe('Dev Banner', () => {
  it('renders the dev banner in dev', () => {
    render(<DevBanner env={"development"} />);
    expect(screen.queryByText(/DEV BUILD/)).toBeInTheDocument();
  });

  it('doesnt render the dev banner in prod', () => {
    render(<DevBanner env={"prod"} />);
    expect(screen.queryByText(/DEV BUILD/)).not.toBeInTheDocument();
  });

  it('doesnt render the dev banner when unknown', () => {
    render(<DevBanner />);
    expect(screen.queryByText(/DEV BUILD/)).not.toBeInTheDocument();
  });
});