import { render, screen } from '@testing-library/react';
import AnchorLink from './AnchorLink';

describe('AnchorLink', () => {
  it('doesnt render the dev banner when unknown', () => {
    render(<AnchorLink targetId='' />);
    const image = screen.getByRole('img', { name: /Copy Link Icon/i });
    expect(image).toBeInTheDocument();
  });
});