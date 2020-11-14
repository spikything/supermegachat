import { render, screen, act } from '@testing-library/react';
import App from './App';

describe('Testing App component', () => {
  test('After act', async () => {
    await act(async () => {
      render(<App />);
      const label = "Sign into MegaChat with Google";
      const linkElement = screen.getByText(label);
      expect(linkElement).toBeInTheDocument();
    });
  });
});
