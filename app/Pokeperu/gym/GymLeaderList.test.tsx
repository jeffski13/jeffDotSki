import { render, screen } from '@testing-library/react';
import GymLeaderList from './GymLeaderList';
import { gymLeaders } from '../gymleaders';

describe('GymLeaderList', () => {
  it('renders the name of each GymLeader', () => {
    render(<GymLeaderList gymLeaders={gymLeaders} />);
    gymLeaders.forEach((leader) => {
      expect(screen.getByText(leader.name)).toBeInTheDocument();
    });
  });
});