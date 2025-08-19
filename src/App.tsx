import React, { useState } from 'react';
import { InputField, DataTable } from './components';
import { Column } from './components/DataTable';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const sampleUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', createdAt: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active', createdAt: '2024-01-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'inactive', createdAt: '2024-01-10' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'active', createdAt: '2024-01-25' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'inactive', createdAt: '2024-01-05' },
];

function App() {
  const [inputValue, setInputValue] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const columns: Column<User>[] = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      sortable: true,
      width: '200px',
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      sortable: true,
    },
    {
      key: 'role',
      title: 'Role',
      dataIndex: 'role',
      sortable: true,
      width: '120px',
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sortable: true,
      width: '120px',
      render: (value: 'active' | 'inactive') => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Created At',
      dataIndex: 'createdAt',
      sortable: true,
      width: '140px',
    },
  ];

  const filteredUsers = sampleUsers.filter(user =>
    user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.email.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleLoadingDemo = () => {
    setIsTableLoading(true);
    setTimeout(() => setIsTableLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            React UI Components
          </h1>
          <p className="text-gray-600 mb-8">
            Production-ready InputField and DataTable components built with React, TypeScript, and Tailwind CSS.
          </p>

          {/* InputField Examples */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">InputField Component</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Examples */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-700">Basic Examples</h3>
                
                <InputField
                  label="Basic Input"
                  placeholder="Enter some text..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  helperText="This is helper text"
                />

                <InputField
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="filled"
                />

                <InputField
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  showPasswordToggle
                  variant="outlined"
                />

                <InputField
                  label="Search with Clear"
                  placeholder="Search users..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  showClearButton
                  variant="ghost"
                />
              </div>

              {/* States and Variants */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-700">States & Variants</h3>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-600">Sizes</h4>
                  <InputField placeholder="Small" size="sm" />
                  <InputField placeholder="Medium (default)" size="md" />
                  <InputField placeholder="Large" size="lg" />
                </div>

                <InputField
                  label="Error State"
                  placeholder="Enter value..."
                  errorMessage="This field is required"
                  invalid
                />

                <InputField
                  label="Loading State"
                  placeholder="Loading..."
                  loading
                />

                <InputField
                  label="Disabled State"
                  placeholder="Can't edit this"
                  disabled
                  value="Disabled value"
                />
              </div>
            </div>
          </section>

          {/* DataTable Example */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">
                DataTable Component
              </h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLoadingDemo}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Demo Loading
                </button>
                <span className="text-sm text-gray-600">
                  Selected: {selectedUsers.length}
                </span>
              </div>
            </div>

            {selectedUsers.length > 0 && (
              <div className="mb-4 p-4 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Selected users:</strong> {selectedUsers.map(u => u.name).join(', ')}
                </p>
              </div>
            )}

            <DataTable
              data={filteredUsers}
              columns={columns}
              loading={isTableLoading}
              selectable
              multiSelect
              onRowSelect={setSelectedUsers}
              emptyMessage="No users found"
              rowKey="id"
            />
          </section>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">InputField Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Multiple variants: filled, outlined, ghost</li>
              <li>• Three sizes: small, medium, large</li>
              <li>• States: disabled, invalid, loading</li>
              <li>• Optional clear button and password toggle</li>
              <li>• Full accessibility support with ARIA labels</li>
              <li>• TypeScript with proper typing</li>
              <li>• Responsive design</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">DataTable Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Generic TypeScript support for any data type</li>
              <li>• Column sorting with visual indicators</li>
              <li>• Single and multi-row selection</li>
              <li>• Loading and empty states</li>
              <li>• Custom cell rendering</li>
              <li>• Responsive design with horizontal scroll</li>
              <li>• Accessible with proper ARIA attributes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;