import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function useChangeUrl() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)

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
    if (newPageSize == 20) {
      params.delete('size')
    } else {
      params.set('size', newPageSize.toString())
    }

    replace(`${pathname}?${params.toString()}`)
  }

  return {
    createPageUrl,
    createPageSizeURL,
    createSearchUrl
  }
}
