import { render, screen } from '@testing-library/react';
import InfoPageContainer from './InfoPage';

describe('Pokedex Component', () => {
  it('renders the back link', () => {
    render(<InfoPageContainer />);
    const link = screen.getByRole('button', { name: 'Go back' });
    expect(link).toBeInTheDocument();
  });

  it('shows all GymLeader properties inside the gym leader blank data UI', () => {
    render(<InfoPageContainer />);
    // There are two copyable textareas on the page (pokemon and gym leader). Find the one for gym leader by looking for a unique key.
    const textareas = screen.getAllByRole('textbox') as HTMLTextAreaElement[];
    expect(textareas.length).toBeGreaterThanOrEqual(2);
    const gymTextarea = textareas.find(t => t.value.includes('environmentImage') || t.value.includes('biome'));
    expect(gymTextarea).toBeDefined();
    const value = gymTextarea!.value;
    // Check each property from the GymLeader interface is present in the template string
    expect(value).toMatch(/id:\s*'/);
    expect(value).toMatch(/name:\s*"/);
    expect(value).toMatch(/image:\s*"/);
    expect(value).toMatch(/environmentImage:\s*"/);
    expect(value).toMatch(/biome:\s*"/);
  });

  it('shows all Monster properties inside the pokemon blank data UI', () => {
    render(<InfoPageContainer />);
    // There are two copyable textareas on the page (pokemon and gym leader). Find the one for pokemon by looking for a unique key.
    const textareas = screen.getAllByRole('textbox') as HTMLTextAreaElement[];
    expect(textareas.length).toBeGreaterThanOrEqual(2);
    const pokemonTextarea = textareas.find(t => t.value.includes('trainerId') || t.value.includes('attack1'));
    expect(pokemonTextarea).toBeDefined();
    const value = pokemonTextarea!.value;
    // Check each property from the Monster interface is present in the template string
    expect(value).toMatch(/id:\s*'/);
    expect(value).toMatch(/name:\s*'/);
    expect(value).toMatch(/trainerId:\s*'/);
    expect(value).toMatch(/hp:\s*10/);
    expect(value).toMatch(/attack:\s*10/);
    expect(value).toMatch(/defense:\s*10/);
    expect(value).toMatch(/specialAttack:\s*10/);
    expect(value).toMatch(/specialDefense:\s*10/);
    expect(value).toMatch(/speed:\s*10/);
    expect(value).toMatch(/type:\s*ElementType\.Normal/);
    expect(value).toMatch(/secondType:\s*ElementType\.Normal/);
    expect(value).toMatch(/image:\s*''/);
    expect(value).toMatch(/description:\s*''/);
    expect(value).toMatch(/attack1:\s*\{/);
    expect(value).toMatch(/attack2:\s*\{/);
    expect(value).toMatch(/inspiration:\s*''/);
  });
});