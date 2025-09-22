'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'

// Third-party Imports
import classnames from 'classnames'

import { flexRender, type FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import type { ThemeColor } from '@core/types'
import type { Employee, PaginationData } from '@/types/apps/employeeTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import modernTableStyles from './EmployeesTable.module.css'
import EmployeeTablePaginationComponent from '@/components/EmployeeTablePaginationComponent'
import { DebouncedInput } from '@/components/DebouncedInput'
import { useEmployeeTable } from '@/hooks/useEmployeeTable'

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

const EmployeesTable = ({ employees, meta }: { employees: Employee[]; meta: PaginationData }) => {
  // States

  const { table, globalFilter, setGlobalFilter } = useEmployeeTable(employees)

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
          component={() => <EmployeeTablePaginationComponent table={table} meta={meta} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>
    </>
  )
}

export default EmployeesTable
