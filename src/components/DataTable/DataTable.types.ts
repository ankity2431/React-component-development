export interface Column<T> {
    key: string;
    title: string;
    dataIndex: keyof T;
    sortable?: boolean;
    width?: string;
    render?: (value: any, record: T, index: number) => React.ReactNode;
  }
  
  export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    selectable?: boolean;
    multiSelect?: boolean;
    onRowSelect?: (selectedRows: T[]) => void;
    onSort?: (dataIndex: keyof T, direction: 'asc' | 'desc') => void;
    className?: string;
    emptyMessage?: string;
    rowKey?: keyof T | ((record: T) => string | number);
  }
  
  export interface SortState<T> {
    column: keyof T | null;
    direction: 'asc' | 'desc' | null;
  }