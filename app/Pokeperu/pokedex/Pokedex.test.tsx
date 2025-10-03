import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pokedex } from './Pokedex';
import mockSelectedMonsters from '../mockMonsters';
import ROUTES from '~/consts/ROUTES';

describe('Pokedex Component', () => {

  it('renders the battleRoute link', () => {
    const battleRoute = '/battle';
    render(<Pokedex storageKey="testKey" selectedMonsters={mockSelectedMonsters} battleRoute={battleRoute} />);
    // Look for a link with the correct href
    const link = screen.getByRole('link', { name: 'Back' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', battleRoute);

    const infoRoute = ROUTES.pokePeru.info;
    const infoLink = screen.getByRole('link', { name: 'Information Link' });
    expect(infoLink).toBeInTheDocument();
    expect(infoLink).toHaveAttribute('href', infoRoute);
  });

  it('displays the monster name when rendered', () => {
    // Render the Pokedex component
    render(<Pokedex storageKey="testKey" selectedMonsters={mockSelectedMonsters} battleRoute="/battle" />);

    // Assert that each monster's name is displayed
    mockSelectedMonsters.forEach((monster) => {
      expect(screen.getAllByText(monster.name).length).toBe(2);
    });
  });

  it('allows editing the inspiration text of a monster', async () => {
    render(<Pokedex storageKey="testKey" selectedMonsters={mockSelectedMonsters} battleRoute="/battle" />);
    // Click the Edit button for the first monster
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    // Find the inspiration textarea (should be the only one for this monster)
    const inspirationInput = screen.getAllByRole('textbox').find(input => input.value === mockSelectedMonsters[0].inspiration);
    expect(inspirationInput).toBeInTheDocument();

    // Type new inspiration
    await userEvent.clear(inspirationInput!);
    await userEvent.type(inspirationInput!, 'Test Inspiration');
    expect(inspirationInput).toHaveValue('Test Inspiration');

    // Save
    fireEvent.click(editButtons[0]);

    // Inspiration should now be visible in the non-edit view (mobile and desktop views)
    const items = screen.findAllByText(/The Test Inspiration Pokemon/)
    expect((await items).length).toBe(2);
  });

  it('allows editing the description text of a monster', async () => {
    render(<Pokedex storageKey="testKey" selectedMonsters={mockSelectedMonsters} battleRoute="/battle" />);
    // Click the Edit button for the first monster
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    // Find the inspiration textarea (should be the only one for this monster)
    const descriptionInput = screen.getAllByRole('textbox').find(input => input.value === mockSelectedMonsters[0].description);
    expect(descriptionInput).toBeInTheDocument();

    // Type new inspiration
    await userEvent.clear(descriptionInput!);
    await userEvent.type(descriptionInput!, 'Test Desc');
    expect(descriptionInput).toHaveValue('Test Desc');

    // Save
    fireEvent.click(editButtons[0]);

    // Inspiration should now be visible in the non-edit view (mobile and desktop views)
    const items = screen.findAllByText(/Test Desc/)
    expect((await items).length).toBe(2);
  });

  it('allows editing the speed stat of a monster', async () => {
    render(<Pokedex storageKey="testKey" selectedMonsters={mockSelectedMonsters} battleRoute="/battle" />);
    // Click the Edit button for the first monster
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    // Find the speed input (should be a number input with the current speed value)
    const speedInput = screen.getAllByDisplayValue(String(mockSelectedMonsters[0].speed)).find(
      input => input.getAttribute('type') === 'number'
    );
    expect(speedInput).toBeInTheDocument();

    // Change the speed value
    await userEvent.clear(speedInput!);
    await userEvent.type(speedInput!, '123');
    expect(speedInput).toHaveValue(123);

    // Save
    fireEvent.click(editButtons[0]);

    // The new speed value should be reflected in the stat bar (look for style width: 123%)
    // and in the total stats
    const totalStats = mockSelectedMonsters[0].hp + mockSelectedMonsters[0].attack + mockSelectedMonsters[0].defense + mockSelectedMonsters[0].specialAttack + mockSelectedMonsters[0].specialDefense + 123;
    expect(screen.getAllByText(`Total Stats: ${totalStats}`)[0]).toBeInTheDocument();
  });

  it('allows editing attack: physical/special, type, and stats via style dropdown', async () => {
    render(<Pokedex storageKey="testKey" selectedMonsters={mockSelectedMonsters} battleRoute="/battle" />);
    // Click the Edit button for the first monster
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    // Change attack1 from physical to special
    const physicalDropdown = screen.getAllByRole('button', { name: /physical/i })[0];
    fireEvent.click(physicalDropdown);
    const specialOption = await screen.findAllByText('Special');
    fireEvent.click(specialOption[0]);
    expect(physicalDropdown).toHaveTextContent('Special');

    // Change attack1 type to Fire
    const typeDropdown = screen.getAllByRole('button', { name: mockSelectedMonsters[0].attack1.type })[0];
    fireEvent.click(typeDropdown);
    const fireOption = await screen.findByText('Ghost');
    fireEvent.click(fireOption);
    expect(typeDropdown).toHaveTextContent('Ghost');

    // Change attack1 stats via style dropdown to 'High Power/Low Accuracy'
    const styleDropdown = screen.getAllByRole('button', { name: /balanced|high pow|low pow/i })[0];
    fireEvent.click(styleDropdown);
    const highPowerOption = await screen.findByText('High Pow, Low Acc');
    fireEvent.click(highPowerOption);
    expect(styleDropdown).toHaveTextContent('High Pow, Low Acc');

    // Save
    fireEvent.click(editButtons[0]);

    // Check that the attack1 stats are updated in the display
    expect(screen.getByText(/50%/)).toBeInTheDocument();
    // Check that the type is Fire
    expect(screen.getAllByText('Ghost').length).toBe(1);
    // Check that the icon is for special (alt text not available, but button text is checked above)
  });

  it('restores monster to original values when Restore button is clicked', async () => {
    render(<Pokedex storageKey="testKeyRestoreTest" selectedMonsters={mockSelectedMonsters} battleRoute="/battle" />);
    // Click the Edit button for the first monster
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    // Find the inspiration edit area
    const inspirationInput = screen.getAllByRole('textbox').find(input => input.value === mockSelectedMonsters[0].inspiration);
    // Type new inspiration
    await userEvent.clear(inspirationInput!);
    await userEvent.type(inspirationInput!, 'Restorable Inspiration');
    
    // Save
    fireEvent.click(editButtons[0]);
    
    // Re-enter edit mode and click Restore
    fireEvent.click(editButtons[0]);
    const restoreButton = screen.getAllByRole('button', { name: /restore/i })[0];
    fireEvent.click(restoreButton);
    
    // The original inspiration should be restored
    expect(screen.queryByText(/Restorable Inspiration/)).not.toBeInTheDocument();
    // save the restored input
    fireEvent.click(editButtons[0]);
    // Inspiration should now be visible in the non-edit view (mobile and desktop views)
    const restoredInspiration = screen.findAllByText(/intitialInspiration/)
    expect((await restoredInspiration).length).toBe(2);
  });

  it('displays an error banner with duplicate monster names when there are duplicate ids', () => {
    // Create two monsters with the same id but different names
    const duplicateId = 'dup-123';
    const monstersWithDupes = [
      {
        ...mockSelectedMonsters[0],
        id: duplicateId,
        name: 'MonsterOne',
      },
      {
        ...mockSelectedMonsters[1],
        id: duplicateId,
        name: 'MonsterTwo',
      },
    ];
    render(<Pokedex storageKey="testKeyDupes" selectedMonsters={monstersWithDupes} battleRoute="/battle" />);
    // The error banner should be in the document
    const banner = screen.getByText(/duplicate monster id\(s\) found/i);
    expect(banner).toBeInTheDocument();
    // The banner should include both monster names
    expect(banner.textContent).toMatch(/MonsterOne/);
    expect(banner.textContent).toMatch(/MonsterTwo/);
  });
});