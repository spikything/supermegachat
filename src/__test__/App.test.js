import { act, render, screen, cleanup } from '@testing-library/react';
import App from '../App';
import Strings from "../Strings";

// This script provides basic smoke testing of the app. 
// More extensive E2E testing is done with the WebDriver (see webdriver folder)

afterEach(cleanup);

describe('App smoke test', () => {
  test('Initial render without error', async () => {
    await act(async () => {

      render(<App />);

      const linkElement = screen.getByText(Strings.SIGN_IN_LABEL);
      expect(linkElement).toBeInTheDocument();

    });
  });
});
