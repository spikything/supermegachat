import { act, render, screen } from '@testing-library/react';
import App from '../App';
import Settings from '../Settings';

// This script provides basic smoke testing of the app. 
// More extensive E2E testing is done with the WebDriver (see webdriver folder)

describe('App smoke test', () => {
  test('Initial render without error', async () => {
    await act(async () => {

      render(<App />);

      const linkElement = screen.getByText(Settings.SIGN_IN_LABEL);
      expect(linkElement).toBeInTheDocument();

    });
  });
});
