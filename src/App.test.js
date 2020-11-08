import { render, screen, act } from '@testing-library/react';
import App from './App';

describe('Testing App component', () => {
  test('After act', async () => {
    await act(async () => {
      render(<App />);
      const linkElement = screen.getByText(/MegaChat/i);
      expect(linkElement).toBeInTheDocument();
    });
  });
});
