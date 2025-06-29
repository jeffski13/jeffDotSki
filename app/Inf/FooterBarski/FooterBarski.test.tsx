import { render, screen } from '@testing-library/react';
import packageJson from '../../../package.json';
import FooterBarski from '.';

describe('FooterBarski Component', () => {
  test('renders main content along with version', () => {
    render(<FooterBarski />);
    expect(screen.getByText(`Version: ${packageJson.version}`)).toBeInTheDocument();
  });

  test('displays the correct version number', () => {
      render(<FooterBarski />);
      
      // Check that the specific version number is displayed
      const versionElement = screen.getByText(/Version: \d+\.\d+\.\d+/);
      expect(versionElement).toBeInTheDocument();
      expect(versionElement.textContent).toBe(`Version: ${packageJson.version}`);
    });
});
