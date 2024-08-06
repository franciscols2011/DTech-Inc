import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Post from '../src/components/Post';
import { BrowserRouter as Router } from 'react-router-dom';

const post = {
  id: 1,
  image: 'https://via.placeholder.com/500',
  message: 'Test message',
  author: {
    id: 1,
    avatar: 'https://via.placeholder.com/32',
    name: 'John',
    surname: 'Doe',
    username: 'johndoe'
  },
  created_at: new Date().toISOString(),
  location: 'Test Location',
  likes: []
};

test('renders post component and handles like button click', async () => {
  render(
    <Router>
      <Post post={post} />
    </Router>
  );

  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('Test message')).toBeInTheDocument();
  expect(screen.getByText('Test Location')).toBeInTheDocument();

  fireEvent.click(screen.getByText(':D'));

});
