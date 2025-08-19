import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputField } from '../components/InputField';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  EyeOff: () => <div data-testid="eye-off-icon">EyeOff</div>,
  X: () => <div data-testid="x-icon">X</div>,
  Loader2: () => <div data-testid="loader-icon">Loader</div>,
}));

describe('InputField', () => {
  it('renders with basic props', () => {
    render(
      <InputField
        label="Test Label"
        placeholder="Test placeholder"
        value="test value"
      />
    );

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
  });

  it('calls onChange when input value changes', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <InputField
        label="Test Input"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText('Test Input');
    await user.type(input, 'hello');

    expect(handleChange).toHaveBeenCalledTimes(5);
  });

  it('displays error message when invalid', () => {
    render(
      <InputField
        label="Test Input"
        errorMessage="This field is required"
        invalid
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
  });

  it('displays helper text when provided', () => {
    render(
      <InputField
        label="Test Input"
        helperText="This is helper text"
      />
    );

    expect(screen.getByText('This is helper text')).toBeInTheDocument();
  });

  it('shows clear button when showClearButton is true and has value', () => {
    const handleChange = jest.fn();

    render(
      <InputField
        label="Test Input"
        value="some value"
        onChange={handleChange}
        showClearButton
      />
    );

    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <InputField
        label="Test Input"
        value="some value"
        onChange={handleChange}
        showClearButton
      />
    );

    const clearButton = screen.getByLabelText('Clear input');
    await user.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith({
      target: { value: '' }
    });
  });

  it('shows password toggle when showPasswordToggle is true', () => {
    render(
      <InputField
        label="Password"
        type="password"
        showPasswordToggle
      />
    );

    expect(screen.getByLabelText('Show password')).toBeInTheDocument();
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
  });

  it('toggles password visibility when toggle button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <InputField
        label="Password"
        type="password"
        value="secret"
        showPasswordToggle
      />
    );

    const input = screen.getByLabelText('Password');
    const toggleButton = screen.getByLabelText('Show password');

    expect(input).toHaveAttribute('type', 'password');

    await user.click(toggleButton);

    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
    expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument();
  });

  it('shows loading icon when loading is true', () => {
    render(
      <InputField
        label="Test Input"
        loading
      />
    );

    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
  });

  it('applies disabled styles and attributes when disabled', () => {
    render(
      <InputField
        label="Test Input"
        disabled
      />
    );

    const input = screen.getByLabelText('Test Input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('cursor-not-allowed');
  });

  it('applies different size classes', () => {
    const { rerender } = render(
      <InputField
        label="Small Input"
        size="sm"
      />
    );

    expect(screen.getByLabelText('Small Input')).toHaveClass('h-8');

    rerender(
      <InputField
        label="Medium Input"
        size="md"
      />
    );

    expect(screen.getByLabelText('Medium Input')).toHaveClass('h-10');

    rerender(
      <InputField
        label="Large Input"
        size="lg"
      />
    );

    expect(screen.getByLabelText('Large Input')).toHaveClass('h-12');
  });
});