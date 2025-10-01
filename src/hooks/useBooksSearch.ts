import { useState, useEffect, useCallback } from 'react'
import { apiGetBooks } from '../api/client'
import type { BookSearchParams, BooksResponse } from '../types'
import { debounce } from '../utils/helpers'

export function useBooksSearch(initialParams: BookSearchParams = {}) {
  const [booksData, setBooksData] = useState<BooksResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState(initialParams.search || '')
  const [sort, setSort] = useState<'name' | 'author'>(initialParams.sort || 'name')
  const [page, setPage] = useState(initialParams.page || 1)

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiGetBooks({
        search: search || undefined,
        sort,
        page,
        limit: 12,
      })
      setBooksData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books')
    } finally {
      setLoading(false)
    }
  }, [search, sort, page])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const handleSearch = useCallback((newSearch: string) => {
    setSearch(newSearch)
    setPage(1)
  }, [])

  const handleSortChange = useCallback((newSort: 'name' | 'author') => {
    setSort(newSort)
    setPage(1)
  }, [])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const clearSearch = useCallback(() => {
    setSearch('')
    setPage(1)
  }, [])

  return {
    booksData,
    loading,
    error,
    search,
    sort,
    page,
    handleSearch,
    handleSortChange,
    handlePageChange,
    clearSearch,
    refetch: fetchBooks,
  }
}
