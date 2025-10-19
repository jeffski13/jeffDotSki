import React from 'react';
import { render, screen } from '@testing-library/react';
import TvShow from './TvShow';

describe('TvShow', () => {
  it('renders Demon Slayer tv show with season and image', () => {
    render(<TvShow title="Demon Slayer" season={2} thumb="/images/demonslayer.png" />);

    // Title text
    expect(screen.getByText('Demon Slayer')).toBeInTheDocument();

    // Season label and number
    expect(screen.getByText('Season:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    // Image alt text
    expect(screen.getByAltText('Demon Slayer Show')).toBeInTheDocument();
  });
});
