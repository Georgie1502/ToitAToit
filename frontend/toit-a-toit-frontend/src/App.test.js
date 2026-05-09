import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the home hero headline', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /plus qu.un toit/i });
  expect(heading).toBeInTheDocument();
});
