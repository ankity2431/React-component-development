export interface InputFieldProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    placeholder?: string;
    helperText?: string;
    errorMessage?: string;
    disabled?: boolean;
    invalid?: boolean;
    loading?: boolean;
    variant?: 'filled' | 'outlined' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    type?: 'text' | 'password' | 'email' | 'number';
    showClearButton?: boolean;
    showPasswordToggle?: boolean;
    className?: string;
    id?: string;
  }
  
  export interface InputFieldRef {
    focus: () => void;
    blur: () => void;
  }