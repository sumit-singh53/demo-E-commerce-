// Checkout Form tests
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import CheckoutForm from '../components/CheckoutForm';

test('renders and submits checkout button', () => {
  const onSuccess = jest.fn();
  render(<CheckoutForm onSuccess={onSuccess} />);
  const btn = screen.getByRole('button', { name: /confirm purchase/i });
  fireEvent.click(btn);
  expect(btn).toBeDisabled();
});
