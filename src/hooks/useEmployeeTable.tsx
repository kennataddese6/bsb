import { useState, useEffect, useMemo } from 'react'

import Typography from '@mui/material/Typography'

import type { ColumnDef } from '@tanstack/react-table'

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  createColumnHelper
} from '@tanstack/react-table'

import { getAvatar } from '@/components/getAvatar'
import { toUSADate } from '@/utils/toUSADate'
import modernTableStyles from '@/views/apps/employees/EmployeesTable.module.css'
import type { Employee, EmployeeTypeWithAction } from '@/types/apps/employeeTypes'

import { fuzzyFilter } from '@/utils/fuzzyFilter' // If you extract fuzzyFilter

export function useEmployeeTable(employees: Employee[]) {
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<Employee[]>(employees)
  const [globalFilter, setGlobalFilter] = useState('')

  useEffect(() => {
    setData(employees)
  }, [employees])

  const columnHelper = createColumnHelper<EmployeeTypeWithAction>()

  // You can import columns from your column definition file
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

      columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: ({ row }) => <Typography color='text.primary'>{toUSADate(row.original.createdAt)}</Typography>
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { rowSelection, globalFilter },
    initialState: { pagination: { pageSize: 10 } },
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

  return { table, rowSelection, setRowSelection, globalFilter, setGlobalFilter }
}
