// MUI Imports
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'

// Third Party Imports
import type { useReactTable } from '@tanstack/react-table'

import type { PaginationData } from '@/types/apps/employeeTypes'
import useChangeUrl from '@/hooks/useChangeUrl'

const TablePaginationComponent = ({
  table,
  meta
}: {
  table: ReturnType<typeof useReactTable>
  meta: PaginationData
}) => {
  const { createPageUrl } = useChangeUrl()

  return (
    <div className='flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2'>
      <Typography color='text.disabled'>
        {`Showing ${
          table.getFilteredRowModel().rows.length === 0
            ? 0
            : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1
        }
        to ${Math.min(
          (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
          table.getFilteredRowModel().rows.length
        )} of ${table.getFilteredRowModel().rows.length} entries`}
      </Typography>
      <Pagination
        shape='rounded'
        color='primary'
        variant='tonal'
        count={meta?.lastPage || 1}
        page={meta?.currentPage || 1}
        onChange={(_, page) => {
          // table.setPageIndex(page - 1)
          createPageUrl(page)
        }}
        showFirstButton
        showLastButton
      />
    </div>
  )
}

export default TablePaginationComponent
