import { render, screen } from '@testing-library/react';
import {GymLeaderList} from './GymLeaderList';
import { gymLeaders } from '../gymleaders';
import ROUTES from '~/consts/ROUTES';

describe('GymLeaderList', () => {
  it('renders the name of each GymLeader', () => {
    render(<GymLeaderList gymLeaders={gymLeaders} monsterList={[]} battleRoute={''} />);
    gymLeaders.forEach((leader) => {
      expect(screen.getByText(leader.name)).toBeInTheDocument();
    });
    gymLeaders.forEach((leader) => {
      expect(screen.getByText(leader.biome)).toBeInTheDocument();
    });
  });

  it('check for navigation links', () => {
    const battleRoute = '/battle';
    render(<GymLeaderList gymLeaders={gymLeaders} monsterList={[]} battleRoute={battleRoute} />);
    // Look for a link with the correct href
    const link = screen.getByRole('link', { name: 'Back' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', battleRoute);
    
    const infoRoute = ROUTES.pokePeru.info;
    const infoLink = screen.getByRole('link', { name: 'Information Link' });
    expect(infoLink).toBeInTheDocument();
    expect(infoLink).toHaveAttribute('href', infoRoute);
  });
});