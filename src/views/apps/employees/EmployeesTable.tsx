'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import type { ThemeColor } from '@core/types'
import type { Employee } from '@/types/apps/employeeTypes'

// Component Imports
import AddEmployeeDialog from './AddEmployeeDialog'
import CustomAvatar from '@core/components/mui/Avatar'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Util Imports
import { getInitials } from '@/utils/getInitials'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Data Imports
import { employees as initialEmployees } from '@/fake-db/apps/employees'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type RoleChipColorType = {
  color: ThemeColor
}

export const roleChipColor: { [key: string]: RoleChipColorType } = {
  admin: { color: 'error' },
  user: { color: 'success' }
}

type EmployeeTypeWithAction = Employee & {
  action?: string
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Column Definitions
const columnHelper = createColumnHelper<EmployeeTypeWithAction>()

const EmployeesTable = () => {
  // States
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<Employee[]>(initialEmployees)
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<EmployeeTypeWithAction, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor('firstName', {
        header: 'Employee',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {getAvatar({
              avatar: row.original.avatar,
              firstName: row.original.firstName,
              lastName: row.original.lastName
            })}
            <div className='flex flex-col items-start'>
              <Typography variant='h6' className='hover:text-primary'>
                {`${row.original.firstName} ${row.original.lastName}`}
              </Typography>
              <Typography variant='body2'>{row.original.email}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.email}</Typography>
      }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <div
              className={classnames('rounded-full px-2 py-1 text-xs font-medium', {
                'bg-error-lighter text-error': row.original.role === 'admin',
                'bg-success-lighter text-success': row.original.role === 'user'
              })}
            >
              {row.original.role.charAt(0).toUpperCase() + row.original.role.slice(1)}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: ({ row }) => <Typography>{new Date(row.original.createdAt).toLocaleDateString()}</Typography>
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: data as Employee[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const getAvatar = (params: Pick<Employee, 'avatar' | 'firstName' | 'lastName'>) => {
    const { avatar, firstName, lastName } = params

    if (avatar) {
      return <CustomAvatar src={avatar} skin='light' size={34} />
    } else {
      return (
        <CustomAvatar skin='light' size={34}>
          {getInitials(`${firstName} ${lastName}`)}
        </CustomAvatar>
      )
    }
  }

  const handleAddEmployee = (newEmployee: Employee) => {
    setData(prev => [...prev, newEmployee])
  }

  return (
    <>
      <Card>
        <CardContent className='flex justify-between flex-wrap max-sm:flex-col sm:items-center gap-4'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>Employees</Typography>
            <Typography variant='body2'>Manage your team members</Typography>
          </div>
          <div className='flex gap-4 max-sm:flex-col max-sm:is-full'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search employees...'
              className='max-sm:is-full'
            />
            <CustomTextField
              select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className='max-sm:is-full sm:is-[80px]'
            >
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='25'>25</MenuItem>
              <MenuItem value='50'>50</MenuItem>
              <MenuItem value='100'>100</MenuItem>
            </CustomTextField>
            <Button variant='tonal' color='secondary' startIcon={<i className='bx-export' />}>
              Export
            </Button>
            <Button
              variant='contained'
              color='primary'
              className='max-sm:is-full'
              startIcon={<i className='bx-plus' />}
              onClick={() => setEmployeeDialogOpen(true)}
            >
              Add Employee
            </Button>
          </div>
        </CardContent>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='bx-chevron-up text-xl' />,
                              desc: <i className='bx-chevron-down text-xl' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No employees found
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>
      <AddEmployeeDialog
        open={employeeDialogOpen}
        handleClose={() => setEmployeeDialogOpen(false)}
        onAddEmployee={handleAddEmployee}
      />
    </>
  )
}

export default EmployeesTable
