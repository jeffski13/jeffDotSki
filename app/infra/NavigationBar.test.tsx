import { render, screen } from '@testing-library/react';
import NavigationBar from './NavigationBar';

describe('NavigationBar', () => {
  it('doesnt render the dev banner when unknown', () => {
    render(<NavigationBar />);
    expect(screen.queryByText(/Resume/)).toBeInTheDocument();
  });
});