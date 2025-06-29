import { render, screen } from '@testing-library/react';
import TitlePage from './index';
import packageJson from '../../package.json';

describe('TitlePage Component', () => {
  test('renders the app version from package.json', () => {
    render(<TitlePage />);
    
    // Check that the version text is rendered
    const versionText = screen.getByText(`Version ${packageJson.version}`);
    expect(versionText).toBeInTheDocument();
  });

  test('displays the correct version number', () => {
    render(<TitlePage />);
    
    // Check that the specific version number is displayed
    const versionElement = screen.getByText(/Version \d+\.\d+\.\d+/);
    expect(versionElement).toBeInTheDocument();
    expect(versionElement.textContent).toBe(`Version ${packageJson.version}`);
  });

  test('renders main content along with version', () => {
    render(<TitlePage />);
    
    // Check that main content is still present
    expect(screen.getByText('Who Is This Jeff Guy?')).toBeInTheDocument();
    expect(screen.getByText(/SZCIN/)).toBeInTheDocument();
    
    // And version is also present
    expect(screen.getByText(`Version ${packageJson.version}`)).toBeInTheDocument();
  });
});
