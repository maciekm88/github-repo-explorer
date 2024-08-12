import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import UserCard from '../UserCard';
import { User, Repository } from '../../app/types';

describe('UserCard Component', () => {
  const mockUser: User = {
    id: 1,
    login: 'maciek-testuser',
    avatar_url: 'https://avatars.githubusercontent.com/u/90285423?v=4',
  };

  const mockRepos: Repository[] = [
    {
      id: 1,
      name: 'my-first-repo',
      description: 'My first app using JS',
      language: 'JavaScript',
      forks: 15,
      stargazers_count: 99,
    },
  ];

  it('Test 1: Should render user information correctly', () => {
    const { getByText } = render(
      <UserCard
        user={mockUser}
        expanded={false}
        repos={mockRepos}
        handleFetchRepos={jest.fn()}
        handleLoadMoreRepos={jest.fn()}
      />,
    );

    expect(getByText('maciek-testuser')).toBeTruthy();
  });

  it('Test 2: Should toggle expanded state when clicked', () => {
    const mockHandleFetchRepos = jest.fn();
    const { getByText } = render(
      <UserCard
        user={mockUser}
        expanded={false}
        repos={mockRepos}
        handleFetchRepos={mockHandleFetchRepos}
        handleLoadMoreRepos={jest.fn()}
      />,
    );

    fireEvent.press(getByText('maciek-testuser'));
    expect(mockHandleFetchRepos).toHaveBeenCalledWith(mockUser);
  });
});
