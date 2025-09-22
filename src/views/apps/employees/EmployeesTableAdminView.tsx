'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import Switch from '@mui/material/Switch'

// Third-party Imports
import classnames from 'classnames'
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
import { toast } from 'react-toastify'

import type { ThemeColor } from '@core/types'
import type { Employee, EmployeeTypeWithAction, PaginationData } from '@/types/apps/employeeTypes'

// Component Imports
import AddEmployeeDialog from './AddEmployeeDialog'
import EditEmployeeDialog from './EditEmployeeDialog'
import ChangePasswordDialog from './ChangePasswordDialog'
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import modernTableStyles from './EmployeesTable.module.css'
import useChangeUrl from '@/hooks/useChangeUrl'
import { toUSADate } from '@/utils/toUSADate'
import EmployeeTablePaginationComponent from '@/components/EmployeeTablePaginationComponent'
import { DebouncedInput } from '@/components/DebouncedInput'
import { getAvatar } from '@/components/getAvatar'
import { fuzzyFilter } from '@/utils/fuzzyFilter'
import { useUpdateEmployeeStatus } from '@/hooks/useUpdateEmployeeStatus'

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

// Column Definitions
const columnHelper = createColumnHelper<EmployeeTypeWithAction>()

const EmployeesTableAdminView = ({ employees, meta }: { employees: Employee[]; meta: PaginationData }) => {
  const { createPageSizeURL } = useChangeUrl()

  // States
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<Employee[]>(employees)
  const [globalFilter, setGlobalFilter] = useState('')

  // State to track which employee is being updated
  const [updatingEmployeeId, setUpdatingEmployeeId] = useState<number | null>(null)

  // Function to update employee account status
  const { updateEmployeeStatus } = useUpdateEmployeeStatus(setUpdatingEmployeeId, setData)

  useEffect(() => {
    setData(employees)
  }, [employees])

  const columns = useMemo<ColumnDef<EmployeeTypeWithAction, any>[]>(
    () => [
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
              {/*               <div
                className={classnames(
                  'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-backgroundPaper',
                  modernTableStyles['status-indicator'],
                  {
                    'bg-error': row.original.role === 'admin',
                    'bg-success': row.original.role === 'employee'
                  }
                )}
              /> */}
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
          <Typography
            variant='caption'
            className='px-2 py-0.5 rounded-md bg-action-hover/50 text-primary font-medium'
            sx={{
              backgroundColor: 'var(--mui-palette-primary-lightOpacity)',
              color: 'var(--mui-palette-primary-main)'
            }}
          >
            {row.original.role.charAt(0).toUpperCase() + row.original.role.slice(1)}
          </Typography>
        )
      }),
      columnHelper.accessor('accountStatus', {
        header: 'Account Status',
        cell: ({ row }) => {
          return (
            <Switch
              checked={row.original.accountStatus === 'active'}
              disabled={updatingEmployeeId === row.original.id}
              onChange={async () => {
                try {
                  await updateEmployeeStatus(row.original)
                } catch (error) {
                  toast.error('Failed to update account status')
                  console.error('Failed to update account status:', error)
                }
              }}
              color='primary'
              inputProps={{ 'aria-label': 'account status toggle' }}
            />
          )
        }
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: ({ row }) => <Typography color='text.primary'>{toUSADate(row.original.createdAt)}</Typography>
      }),
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className={`flex items-center gap-1 ${modernTableStyles['action-buttons']}`}>
            <Button
              variant='text'
              color='inherit'
              size='large'
              className='min-w-0 px-2 py-1 rounded-lg hover:shadow-md transition-all duration-200'
              onClick={() => {
                setSelectedEmployee(row.original)
                setEditDialogOpen(true)
              }}
              title='Edit Employee'
            >
              <i className='bx-edit text-lg' />
            </Button>
            <Button
              variant='text'
              color='inherit'
              size='large'
              className='min-w-0 px-2 py-1 rounded-lg hover:shadow-md transition-all duration-200'
              onClick={() => {
                setSelectedEmployee(row.original)
                setChangePasswordDialogOpen(true)
              }}
              title='Change Password'
            >
              <i className='bx-lock-alt text-lg' />
            </Button>
          </div>
        )
      }
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

  const handleAddEmployee = (newEmployee: Employee) => {
    setData(prev => [newEmployee, ...prev])
  }

  const handleUpdateEmployee = (employeeId: number, updatedData: Partial<Employee>) => {
    setData(prev => prev.map(emp => (emp.id === employeeId ? { ...emp, ...updatedData } : emp)))
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
              value={meta?.pageSize || 10}
              onChange={e => {
                table.setPageSize(Number(e.target.value))
                createPageSizeURL(Number(e.target.value))
              }}
              className='max-sm:is-full sm:is-[100px]'
            >
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='25'>25</MenuItem>
              <MenuItem value='50'>50</MenuItem>
              <MenuItem value='100'>100</MenuItem>
            </CustomTextField>
            <Button
              variant='contained'
              color='primary'
              className='max-sm:is-full shadow-lg hover:shadow-xl transition-all duration-200'
              startIcon={<i className='bx-plus' />}
              onClick={() => setEmployeeDialogOpen(true)}
            >
              Add Employee
            </Button>
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
          component={() => <EmployeeTablePaginationComponent table={table} meta={meta} />}
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
      />
    </>
  )
}

export default EmployeesTableAdminView
