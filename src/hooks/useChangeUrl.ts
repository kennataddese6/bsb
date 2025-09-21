import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function useChangeUrl() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)

  const createDateUrl = (startDate?: Date, endDate?: Date) => {
    if (startDate) {
      params.set('startDate', startDate.toISOString()) // better format than toString
    } else {
      params.delete('startDate')
    }

    if (endDate) {
      params.set('endDate', endDate.toISOString())
    } else {
      params.delete('endDate')
    }

    replace(`${pathname}?${params.toString()}`)
  }

  const createSalesFrequencyUrl = (query: 'yearly' | 'quarterly') => {
    if (!query || query === 'yearly') {
      params.delete('freq')
    } else {
      params.set('freq', query.toString())
    }

    replace(`${pathname}?${params.toString()}`)
  }

  const createSalesPersonUrl = (salesId?: string | null) => {
    if (!salesId) {
      params.delete('sales')
    } else {
      params.set('sales', salesId)
    }

    replace(`${pathname}?${params.toString()}`)
  }

  const createSearchUrl = (query: any) => {
    if (!query) {
      params.delete('search')
    } else {
      params.set('search', query.toString())
    }

    replace(`${pathname}?${params.toString()}`)
  }

  const createPageUrl = (pageNumber: number) => {
    if (pageNumber == 1 || pageNumber == 0) {
      params.delete('page')
    } else {
      params.set('page', pageNumber.toString())
    }

    replace(`${pathname}?${params.toString()}`)
  }

  const createPageSizeURL = (newPageSize: number | string) => {
    if (newPageSize == 10) {
      params.delete('size')
    } else {
      params.set('size', newPageSize.toString())
    }

    replace(`${pathname}?${params.toString()}`)
  }

  return {
    createPageUrl,
    createPageSizeURL,
    createSearchUrl,
    createSalesFrequencyUrl,
    createSalesPersonUrl,
    createDateUrl
  }
}
