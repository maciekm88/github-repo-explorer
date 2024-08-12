import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import DialogComponent from '../DialogComponent';

describe('DialogComponent', () => {
  const mockSetDialogVisible = jest.fn();

  beforeEach(() => {
    mockSetDialogVisible.mockClear();
  });

  const renderComponent = (props: any) =>
    render(
      <PaperProvider>
        <DialogComponent {...props} />
      </PaperProvider>,
    );

  it('Test 1: Should render the dialog with correct title and content', () => {
    const { getByTestId, getByText } = renderComponent({
      dialogVisible: true,
      setDialogVisible: mockSetDialogVisible,
    });

    expect(getByTestId('dialog-title')).toBeTruthy();
    expect(getByText('Username does not exist')).toBeTruthy();
    expect(
      getByText('The username you entered does not exist on GitHub. Please search again.'),
    ).toBeTruthy();
  });

  it('Test 2: Should call setDialogVisible when OK button is pressed', () => {
    jest.useFakeTimers();
    const { getByTestId } = renderComponent({
      dialogVisible: true,
      setDialogVisible: mockSetDialogVisible,
    });

    fireEvent.press(getByTestId('dialog-ok-button'));

    expect(mockSetDialogVisible).toHaveBeenCalledWith(false);
  });
});
