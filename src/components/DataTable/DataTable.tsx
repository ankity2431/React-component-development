import React, { useState, useCallback, useMemo } from 'react';
import { ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { DataTableProps, SortState, Column } from './DataTable.types';

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  multiSelect = true,
  onRowSelect,
  onSort,
  className = '',
  emptyMessage = 'No data available',
  rowKey = 'id',
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [sortState, setSortState] = useState<SortState<T>>({ column: null, direction: null });

  const getRowKey = useCallback((record: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] ?? index;
  }, [rowKey]);

  const handleSort = useCallback((column: Column<T>) => {
    if (!column.sortable) return;

    const newDirection = 
      sortState.column === column.dataIndex && sortState.direction === 'asc' 
        ? 'desc' 
        : 'asc';

    const newSortState = { column: column.dataIndex, direction: newDirection };
    setSortState(newSortState);
    
    if (onSort) {
      onSort(column.dataIndex, newDirection);
    }
  }, [sortState, onSort]);

  const sortedData = useMemo(() => {
    if (!sortState.column || !sortState.direction) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortState.column!];
      const bValue = b[sortState.column!];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortState.direction === 'asc' ? -1 : 1;
      if (bValue == null) return sortState.direction === 'asc' ? 1 : -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortState.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return sortState.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortState.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortState]);

  const handleRowSelection = useCallback((record: T, isSelected: boolean) => {
    const key = getRowKey(record, 0);
    const newSelectedRows = new Set(selectedRows);

    if (multiSelect) {
      if (isSelected) {
        newSelectedRows.add(key);
      } else {
        newSelectedRows.delete(key);
      }
    } else {
      if (isSelected) {
        newSelectedRows.clear();
        newSelectedRows.add(key);
      } else {
        newSelectedRows.delete(key);
      }
    }

    setSelectedRows(newSelectedRows);
    
    if (onRowSelect) {
      const selectedRecords = data.filter(record => 
        newSelectedRows.has(getRowKey(record, 0))
      );
      onRowSelect(selectedRecords);
    }
  }, [selectedRows, multiSelect, data, getRowKey, onRowSelect]);

  const handleSelectAll = useCallback((isSelected: boolean) => {
    if (!multiSelect) return;

    const newSelectedRows = new Set<string | number>();
    if (isSelected) {
      data.forEach((record, index) => {
        newSelectedRows.add(getRowKey(record, index));
      });
    }

    setSelectedRows(newSelectedRows);
    
    if (onRowSelect) {
      onRowSelect(isSelected ? data : []);
    }
  }, [multiSelect, data, getRowKey, onRowSelect]);

  const isAllSelected = data.length > 0 && selectedRows.size === data.length;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < data.length;

  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    const isActive = sortState.column === column.dataIndex;
    const direction = isActive ? sortState.direction : null;

    return (
      <span className="ml-1 inline-flex flex-col">
        <ChevronUp 
          className={`h-3 w-3 ${
            isActive && direction === 'asc' 
              ? 'text-blue-600' 
              : 'text-gray-400'
          }`} 
        />
        <ChevronDown 
          className={`h-3 w-3 -mt-1 ${
            isActive && direction === 'desc' 
              ? 'text-blue-600' 
              : 'text-gray-400'
          }`} 
        />
      </span>
    );
  };

  if (loading) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="px-6 py-3 w-12">
                  {multiSelect && (
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={input => {
                        if (input) input.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      aria-label="Select all rows"
                    />
                  )}
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                    ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
                  `}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                  role={column.sortable ? 'button' : undefined}
                  aria-sort={
                    sortState.column === column.dataIndex 
                      ? sortState.direction === 'asc' ? 'ascending' : 'descending'
                      : undefined
                  }
                >
                  <div className="flex items-center">
                    {column.title}
                    {renderSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((record, index) => {
                const key = getRowKey(record, index);
                const isSelected = selectedRows.has(key);
                
                return (
                  <tr 
                    key={key}
                    className={`
                      hover:bg-gray-50 transition-colors duration-150
                      ${isSelected ? 'bg-blue-50' : ''}
                    `}
                  >
                    {selectable && (
                      <td className="px-6 py-4 w-12">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleRowSelection(record, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          aria-label={`Select row ${index + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td 
                        key={`${key}-${column.key}`}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {column.render 
                          ? column.render(record[column.dataIndex], record, index)
                          : String(record[column.dataIndex] ?? '')
                        }
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;