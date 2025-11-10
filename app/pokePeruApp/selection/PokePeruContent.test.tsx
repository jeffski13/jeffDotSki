import { render, screen, fireEvent } from '@testing-library/react';
import { PokePeruContent } from '../index';
import mockSelectedMonsters, { mockTrainers } from '../mockMonsters';
import ROUTES from '~/consts/ROUTES';
import MonsterSelection from './MonsterSelection';

describe('PokePeruStart Component', () => {
  test('handleMonsterSelect modifies the selected monsters', () => {
    render(<PokePeruContent
      monsters={mockSelectedMonsters}
      gymLeaders={mockTrainers}
      dexRoute='' battleRoute={''} gymRoute={''} />);

    // Find the buttons for the monsters
    const pikachuButton = screen.getByText(/Pikachu/i);
    const charmanderButton = screen.getByText(/Charmander/i);

    // Simulate selecting Pikachu
    fireEvent.click(pikachuButton);
    expect(screen.getByText(/Player 2, choose your monster:/i)).toBeInTheDocument();

    // Simulate selecting Charmander
    fireEvent.click(charmanderButton);
    expect(screen.getByText(/Selection Results/i)).toBeInTheDocument();

    // Verify that the selected monsters are displayed in the results
    expect(screen.getByText(/User 1 chose: Pikachu/i)).toBeInTheDocument();
    expect(screen.getByText(/User 2 chose: Charmander/i)).toBeInTheDocument();
  });

  it('check for navigation links', () => {
    const battleRoute = '/battle';
    const dexRoute = '/dex';
    const gymRoute = '/gym';
    render(<PokePeruContent
      monsters={mockSelectedMonsters}
      gymLeaders={mockTrainers}
      dexRoute={dexRoute} battleRoute={battleRoute} gymRoute={gymRoute} />);
    // Look for a link with the correct href
    const gymLink = screen.getByRole('link', { name: 'Gym Leaders' });
    expect(gymLink).toBeInTheDocument();
    expect(gymLink).toHaveAttribute('href', gymRoute);

    const dexLink = screen.getByRole('link', { name: 'Pokedex' });
    expect(dexLink).toBeInTheDocument();
    expect(dexLink).toHaveAttribute('href', dexRoute);

    const infoRoute = ROUTES.pokePeru.info;
    const infoLink = screen.getByRole('link', { name: 'Information Link' });
    expect(infoLink).toBeInTheDocument();
    expect(infoLink).toHaveAttribute('href', infoRoute);
  });

  it('make sure accessibility is labeled up to 9', () => {
    const moreThanTenMonsters = [...mockSelectedMonsters];
    for (let index = 0; index < 10; index++) {
      const newMonster = { ...mockSelectedMonsters[0] };
      newMonster.id = 'moreThanTenMonsters' + index;
      moreThanTenMonsters.push(newMonster);
    }

    render(<MonsterSelection
      currentPlayer={1}
      selectedMonstersIds={[]}
      monsters={moreThanTenMonsters}
      gymLeaders={mockTrainers} handleMonsterSelect={() => { }}
      dexRoute={'/dex'} gymLeaderRoute={'/gym'} />
    );
    //valid keyboard shortcut text should be present
    expect(screen.getByText(/Press 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Press 9/i)).toBeInTheDocument();
    //keyboard shortcuts stop at 9
    const nonExistentText = screen.queryByText(/Press 10/i);
    expect(nonExistentText).toBeNull();
  });
});