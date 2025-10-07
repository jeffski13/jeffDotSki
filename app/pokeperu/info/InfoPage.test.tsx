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
});