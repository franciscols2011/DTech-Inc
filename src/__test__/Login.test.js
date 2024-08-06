import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Login from '../components/Login';
import { AuthProvider } from '../auth/AuthContext';

test('renders login form and submits', async () => {
  render(
    <AuthProvider>
      <Login />
    </AuthProvider>
  );

  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
  fireEvent.click(screen.getByText(/login/i));

  expect(await screen.findByText(/logged in successfully/i)).toBeInTheDocument();
});
