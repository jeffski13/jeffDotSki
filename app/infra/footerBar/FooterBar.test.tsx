import { render, screen } from '@testing-library/react';
import packageJson from '../../../package.json';
import FooterBar from '.';

describe('FooterBar Component', () => {
  test('renders main content along with version', () => {
    render(<FooterBar />);
    expect(screen.getByText(`Version: ${packageJson.version}`)).toBeInTheDocument();
  });

  test('renders the made by section', () => {
    render(<FooterBar />);
    expect(screen.getByText(/Built with /)).toBeInTheDocument();
    expect(screen.getByText(/by Jeff Szcinski/)).toBeInTheDocument();
  });

  test('displays the correct version number', () => {
    render(<FooterBar />);

    // Check that the specific version number is displayed
    const versionElement = screen.getByText(/Version: \d+\.\d+\.\d+/);
    expect(versionElement).toBeInTheDocument();
    expect(versionElement.textContent).toBe(`Version: ${packageJson.version}`);
  });
});
