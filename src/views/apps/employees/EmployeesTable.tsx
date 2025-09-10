'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
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
import type { Employee, PaginationData } from '@/types/apps/employeeTypes'

// Component Imports
import AddEmployeeDialog from './AddEmployeeDialog'
import EditEmployeeDialog from './EditEmployeeDialog'
import ChangePasswordDialog from './ChangePasswordDialog'
import CustomAvatar from '@core/components/mui/Avatar'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Util Imports
import { getInitials } from '@/utils/getInitials'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import modernTableStyles from './EmployeesTable.module.css'

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
  employee: { color: 'success' }
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

const EmployeesTable = ({ employees, meta }: { employees: Employee[]; meta: PaginationData }) => {
  // States
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<Employee[]>(employees)
  const [globalFilter, setGlobalFilter] = useState('')

  useEffect(() => {
    setData(employees)
  }, [employees])

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
      columnHelper.accessor('fname', {
        header: 'Employee',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className={`relative ${modernTableStyles['avatar-container']}`}>
              {getAvatar({
                avatar: row.original.avatar,
                fname: row.original.fname,
                lname: row.original.lname
              })}
              <div
                className={classnames(
                  'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-backgroundPaper',
                  modernTableStyles['status-indicator'],
                  {
                    'bg-error': row.original.role === 'admin',
                    'bg-success': row.original.role === 'employee'
                  }
                )}
              />
            </div>
            <div className='flex flex-col items-start'>
              <Typography variant='h6' className='hover:text-primary transition-colors duration-200 font-semibold'>
                {`${row.original.fname} ${row.original.lname}`}
              </Typography>
              <Typography variant='body2' className='text-textSecondary'>
                {row.original.email}
              </Typography>
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
              className={classnames(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm transition-all duration-200',
                modernTableStyles['role-badge'],
                {
                  'bg-gradient-to-r from-error-lighter to-error/20 text-error border border-error/20':
                    row.original.role === 'admin',
                  'bg-gradient-to-r from-success-lighter to-success/20 text-success border border-success/20':
                    row.original.role === 'employee'
                }
              )}
            >
              <div
                className={classnames('w-2 h-2 rounded-full', {
                  'bg-error': row.original.role === 'admin',
                  'bg-success': row.original.role === 'employee'
                })}
              />
              {row.original.role.charAt(0).toUpperCase() + row.original.role.slice(1)}
            </div>
          </div>
        )
      }),

      columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.createdAt}</Typography>
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

  const getAvatar = (params: Pick<Employee, 'avatar' | 'fname' | 'lname'>) => {
    const { avatar, fname, lname } = params

    if (avatar) {
      return <CustomAvatar src={avatar} skin='light' size={34} />
    } else {
      return (
        <CustomAvatar skin='light' size={34}>
          {getInitials(`${fname} ${lname}`)}
        </CustomAvatar>
      )
    }
  }

  const handleAddEmployee = (newEmployee: Employee) => {
    setData(prev => [...prev, newEmployee])
  }

  const handleUpdateEmployee = (employeeId: number, updatedData: Partial<Employee>) => {
    setData(prev => prev.map(emp => (emp.id === employeeId ? { ...emp, ...updatedData } : emp)))
  }

  const handleChangePassword = (employeeId: number, newPassword: string) => {
    // In a real app, you would make an API call to update the password
    // For now, we'll just show a success message
    console.log(`Password changed for employee ${employeeId}`, newPassword)
  }

  return (
    <>
      <Card className='shadow-lg border-0'>
        <CardContent className='flex justify-between flex-wrap max-sm:flex-col sm:items-center gap-6 p-6'>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-primary-lighter rounded-lg'>
                <i className='bx-user-plus text-2xl text-primary' />
              </div>
              <div>
                <Typography variant='h4' className='font-bold'>
                  Employees
                </Typography>
                <Typography variant='body2' className='text-textSecondary'>
                  Manage your team members and their access
                </Typography>
              </div>
            </div>
          </div>
          <div className='flex gap-3 max-sm:flex-col max-sm:is-full'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search employees...'
              className='max-sm:is-full min-w-[250px]'
              slotProps={{
                input: {
                  startAdornment: <i className='bx-search text-xl text-textSecondary mr-2' />
                }
              }}
            />
            <CustomTextField
              select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className='max-sm:is-full sm:is-[100px]'
            >
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='25'>25</MenuItem>
              <MenuItem value='50'>50</MenuItem>
              <MenuItem value='100'>100</MenuItem>
            </CustomTextField>
          </div>
        </CardContent>
        <div className='overflow-x-auto'>
          <table className={`${tableStyles.table} ${modernTableStyles['modern-table']}`}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className='border-b border-divider'>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className='px-6 py-4 text-left font-semibold text-textPrimary'>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames('flex items-center gap-2', {
                              'cursor-pointer select-none hover:text-primary transition-colors duration-200':
                                header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='bx-chevron-up text-lg text-primary' />,
                              desc: <i className='bx-chevron-down text-lg text-primary' />
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
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center py-12'>
                    <div className='flex flex-col items-center gap-3'>
                      <i className='bx-user-x text-6xl text-textSecondary' />
                      <Typography variant='h6' className='text-textSecondary'>
                        No employees found
                      </Typography>
                      <Typography variant='body2' className='text-textSecondary'>
                        Try adjusting your search criteria or add a new employee
                      </Typography>
                    </div>
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
                      <tr
                        key={row.id}
                        className={classnames(
                          'border-b border-divider hover:bg-backgroundPaper/50 transition-all duration-200 group',
                          { 'bg-primary-lighter/20': row.getIsSelected() }
                        )}
                      >
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className='px-6 py-4'>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} meta={meta} />}
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
      <EditEmployeeDialog
        open={editDialogOpen}
        handleClose={() => {
          setEditDialogOpen(false)
          setSelectedEmployee(null)
        }}
        employee={selectedEmployee}
        onUpdateEmployee={handleUpdateEmployee}
      />
      <ChangePasswordDialog
        open={changePasswordDialogOpen}
        handleClose={() => {
          setChangePasswordDialogOpen(false)
          setSelectedEmployee(null)
        }}
        employee={selectedEmployee}
        onChangePassword={handleChangePassword}
      />
    </>
  )
}

export default EmployeesTable
