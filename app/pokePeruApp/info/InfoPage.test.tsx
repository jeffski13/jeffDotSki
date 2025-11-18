import { render, screen } from '@testing-library/react';
import InfoPageContainer, { InfoPage } from './InfoPage';
import { monsters } from '../monsters';
import { gymLeaders } from '../gymleaders';
import { locationProviderMock } from '~/aboutMeSection/PortfolioProps';

describe('Pokedex Component', () => {
  it('renders the back link', () => {
    render(<InfoPage isTestEnv={true} locationProvider={locationProviderMock} />);
    const link = screen.getByRole('button', { name: 'Go back' });
    expect(link).toBeInTheDocument();
  });

  it('shows all GymLeader properties inside the gym leader blank data UI', () => {
    render(<InfoPage isTestEnv={true} locationProvider={locationProviderMock} />);
    // There are two copyable textareas on the page (pokemon and gym leader). Find the one for gym leader by looking for a unique key.
    const textareas = screen.getAllByRole('textbox') as HTMLTextAreaElement[];
    expect(textareas.length).toBeGreaterThanOrEqual(2);
    const gymTextarea = textareas.find(t => t.value.includes('environmentImage') || t.value.includes('biome'));
    expect(gymTextarea).toBeDefined();
    const value = gymTextarea!.value;
    // Check each property from the GymLeader interface is present in the template string
    const objectWithAllProperties = gymLeaders[0];

    const expectedPatterns: Array<RegExp> = [];
    Object.keys(objectWithAllProperties).forEach(key => {
      let flags = "s";
      let regex = new RegExp(key, flags);
      expectedPatterns.push(regex)
    });

    expectedPatterns.forEach((pattern) => {
      expect(value).toMatch(pattern);
    });
  });

  it('shows all Monster properties inside the pokemon blank data UI', () => {
    render(<InfoPage isTestEnv={true} locationProvider={locationProviderMock} />);
    // There are two copyable textareas on the page (pokemon and gym leader). Find the one for pokemon by looking for a unique key.
    const textareas = screen.getAllByRole('textbox') as HTMLTextAreaElement[];
    expect(textareas.length).toBeGreaterThanOrEqual(2);
    const pokemonTextarea = textareas.find(t => t.value.includes('trainerId') || t.value.includes('attack1'));
    expect(pokemonTextarea).toBeDefined();
    const value = pokemonTextarea!.value;
    
    // Check each property from the Monster interface is present in the template string
    const objectWithAllProperties = monsters[0];

    const expectedPatterns: Array<RegExp> = [];
    Object.keys(objectWithAllProperties).forEach(key => {
      let flags = "s";
      let regex = new RegExp(key, flags);
      expectedPatterns.push(regex)
    });

    expectedPatterns.forEach((pattern) => {
      expect(value).toMatch(pattern);
    });
  });
});