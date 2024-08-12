import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SearchBar from '../SearchBar';

describe('SearchBar Component', () => {
  const mockSetUsername = jest.fn();
  const mockHandleSearchUsers = jest.fn();
  const mockHasErrors = jest.fn();

  beforeEach(() => {
    mockSetUsername.mockClear();
    mockHandleSearchUsers.mockClear();
    mockHasErrors.mockClear();
  });

  it('Test 1: Should render the search input and button correctly', () => {
    jest.useFakeTimers(); // mocks out setTimeout and other timer functions with mock functions.
    const { getByRole, getByTestId, getByLabelText, getByText } = render(
      <SearchBar
        username="test"
        setUsername={mockSetUsername}
        hasErrors={mockHasErrors}
        handleSearchUsers={mockHandleSearchUsers}
      />,
    );
    //TextInput queries
    expect(getByLabelText('GitHub username')).toBeTruthy();
    expect(getByTestId('search-input')).toBeTruthy();
    expect(getByRole('search')).toBeTruthy();
    //Search button queries
    expect(getByTestId('search-button')).toBeTruthy();
    expect(getByText('Search')).toBeTruthy();
  });

  it('Test 2: Should call setUsername when input text changes', () => {
    const { getByLabelText } = render(
      <SearchBar
        username=""
        setUsername={mockSetUsername}
        hasErrors={mockHasErrors}
        handleSearchUsers={mockHandleSearchUsers}
      />,
    );

    const input = getByLabelText('GitHub username');
    fireEvent.changeText(input, 'maciekm88');
    expect(mockSetUsername).toHaveBeenCalledWith('maciekm88');
  });

  it('Test 3: Should call handleSearchUsers when the button is pressed', () => {
    mockHasErrors.mockReturnValue(false);

    const { getByText } = render(
      <SearchBar
        username="test"
        setUsername={mockSetUsername}
        hasErrors={mockHasErrors}
        handleSearchUsers={mockHandleSearchUsers}
      />,
    );

    const button = getByText('Search');
    fireEvent.press(button);

    expect(mockHandleSearchUsers).toHaveBeenCalled();
  });
});
