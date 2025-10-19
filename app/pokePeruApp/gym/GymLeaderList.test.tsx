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

  it('renders monsters owned by a gym leader', () => {
    // Use the first gym leader's id to create owned monsters
    const leader = gymLeaders[0];
    const ownedMonsters = [
      { id: 'm-test-1', name: 'TestMon1', trainerId: leader.id, image: '/img1.png' },
      { id: 'm-test-2', name: 'TestMon2', trainerId: leader.id, image: '/img2.png' },
    ];

    render(<GymLeaderList gymLeaders={gymLeaders} monsterList={ownedMonsters as any} battleRoute={''} />);

    // The component should render the monster images (alt text is the monster name)
    expect(screen.getByAltText('TestMon1')).toBeInTheDocument();
    expect(screen.getByAltText('TestMon2')).toBeInTheDocument();
  });
});