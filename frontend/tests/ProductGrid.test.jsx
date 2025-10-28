// Product Grid tests
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductGrid from '../components/ProductGrid';

test('renders loading skeleton when loading', () => {
  render(<ProductGrid products={[]} loading={true} />);
  expect(screen.getAllByText(/loading/i).length).toBeGreaterThan(0);
});
