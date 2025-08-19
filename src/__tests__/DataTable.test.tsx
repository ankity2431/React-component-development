import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable } from '../components/DataTable';
import { Column } from '../components/DataTable';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronUp: () => <div data-testid="chevron-up">ChevronUp</div>,
  ChevronDown: () => <div data-testid="chevron-down">ChevronDown</div>,
  Loader2: () => <div data-testid="loader">Loader</div>,
}));

interface TestUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

const mockUsers: TestUser[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
];

const mockColumns: Column<TestUser>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
  { key: 'role', title: 'Role', dataIndex: 'role', sortable: false },
];

describe('DataTable', () => {
  it('renders table with data and columns', () => {
    render(
      <DataTable
        data={mockUsers}
        columns={mockColumns}
      />
    );

    // Check headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();

    // Check data rows
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <DataTable
        data={[]}
        columns={mockColumns}
        loading={true}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(
      <DataTable
        data={[]}
        columns={mockColumns}
        emptyMessage="No users found"
      />
    );

    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('handles column sorting', async () => {
    const user = userEvent.setup();
    const mockOnSort = jest.fn();

    render(
      <DataTable
        data={mockUsers}
        columns={mockColumns}
        onSort={mockOnSort}
      />
    );

    const nameHeader = screen.getByText('Name');
    await user.click(nameHeader);

    expect(mockOnSort).toHaveBeenCalledWith('name', 'asc');

    // Click again for descending
    await user.click(nameHeader);
    expect(mockOnSort).toHaveBeenCalledWith('name', 'desc');
  });

  it('displays sort icons for sortable columns', () => {
    render(
      <DataTable
        data={mockUsers}
        columns={mockColumns}
      />
    );

    // Name and Email columns are sortable
    const nameHeader = screen.getByText('Name').closest('th');
    const emailHeader = screen.getByText('Email').closest('th');
    const roleHeader = screen.getByText('Role').closest('th');

    expect(nameHeader).toContainElement(screen.getAllByTestId('chevron-up')[0]);
    expect(emailHeader).toContainElement(screen.getAllByTestId('chevron-up')[1]);
    
    // Role column is not sortable, so no icons
    expect(roleHeader?.querySelectorAll('[data-testid="chevron-up"]')).toHaveLength(0);
  });

  it('handles row selection', async () => {
    const user = userEvent.setup();
    const mockOnRowSelect = jest.fn();

    render(
      <DataTable
        data={mockUsers}
        columns={mockColumns}
        selectable={true}
        onRowSelect={mockOnRowSelect}
      />
    );

    // Should have checkboxes
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(4); // 3 rows + 1 select all

    // Click first row checkbox
    await user.click(checkboxes[1]); // Skip select all checkbox

    expect(mockOnRowSelect).toHaveBeenCalledWith([mockUsers[0]]);
  });

  it('handles select all functionality', async () => {
    const user = userEvent.setup();
    const mockOnRowSelect = jest.fn();

    render(
      <DataTable
        data={mockUsers}
        columns={mockColumns}
        selectable={true}
        multiSelect={true}
        onRowSelect={mockOnRowSelect}
      />
    );

    const selectAllCheckbox = screen.getByLabelText('Select all rows');
    await user.click(selectAllCheckbox);

    expect(mockOnRowSelect).toHaveBeenCalledWith(mockUsers);
  });

  it('handles single selection mode', async () => {
    const user = userEvent.setup();
    const mockOnRowSelect = jest.fn();

    render(
      <DataTable
        data={mockUsers}
        columns={mockColumns}
        selectable={true}
        multiSelect={false}
        onRowSelect={mockOnRowSelect}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    
    // No select all checkbox in single select mode
    expect(checkboxes).toHaveLength(3);

    // Select first row
    await user.click(checkboxes[0]);
    expect(mockOnRowSelect).toHaveBeenCalledWith([mockUsers[0]]);

    // Select second row should replace first selection
    await user.click(checkboxes[1]);
    expect(mockOnRowSelect).toHaveBeenCalledWith([mockUsers[1]]);
  });

  it('renders custom cell content', () => {
    const columnsWithRender: Column<TestUser>[] = [
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
        render: (value) => <strong>{value}</strong>
      },
      { key: 'email', title: 'Email', dataIndex: 'email' },
    ];

    render(
      <DataTable
        data={mockUsers}
        columns={columnsWithRender}
      />
    );

    expect(screen.getByText('John Doe')).toHaveStyle('font-weight: bold');
  });

  it('applies hover effects to rows', () => {
    render(
      <DataTable
        data={mockUsers}
        columns={mockColumns}
      />
    );

    const firstRow = screen.getByText('John Doe').closest('tr');
    expect(firstRow).toHaveClass('hover:bg-gray-50');
  });
});