import { render, screen } from '@testing-library/react';
import App from './App';

test('app title visible', () => {
  render(<App />);
  const linkElement = screen.getByText(/MegaChat/i);
  expect(linkElement).toBeInTheDocument();
});
