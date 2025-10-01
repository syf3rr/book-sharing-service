import { useState } from 'react'
import { 
  Alert, 
  Box, 
  Button, 
  CircularProgress, 
  FormControl, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Pagination, 
  Select, 
  Stack, 
  TextField, 
  Typography, 
  Chip
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useBooksSearch } from '../hooks/useBooksSearch'
import { ROUTES } from '../constants'
import BookCard from '../components/BookCard'

export default function BooksList() {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')
  
  const {
    booksData,
    loading,
    error,
    search,
    sort,
    handleSearch,
    handleSortChange,
    handlePageChange,
    clearSearch,
  } = useBooksSearch()

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchInput)
  }

  const onBookClick = (bookId: string) => {
    navigate(ROUTES.BOOK_DETAIL(bookId))
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">All Books</Typography>
      
      {/* Search and Sort Controls */}
      <Box component="form" onSubmit={onSearchSubmit}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            label="Search books..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ minWidth: 200 }}
            placeholder="Search by name or author"
          />
          <Button type="submit" variant="contained">
            Search
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => {
              setSearchInput('')
              clearSearch()
            }}
          >
            Clear
          </Button>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sort}
              label="Sort by"
              onChange={(e) => handleSortChange(e.target.value as 'name' | 'author')}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="author">Author</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Results Info */}
      {booksData && (
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Showing {booksData.books.length} of {booksData.pagination.totalBooks} books
          </Typography>
          {search && (
            <Chip 
              label={`Search: "${search}"`} 
              onDelete={() => {
                setSearchInput('')
                clearSearch()
              }}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      )}

      {/* Error Alert */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Loading */}
      {loading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Books Grid */}
      {!loading && booksData && (
        <>
          {booksData.books.length === 0 ? (
            <Alert severity="info">
              {search ? 'No books found matching your search.' : 'No books available yet.'}
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {booksData.books.map((book) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                  <BookCard 
                    book={book} 
                    onViewDetails={onBookClick}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Pagination */}
          {booksData.pagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" py={4}>
              <Pagination
                count={booksData.pagination.totalPages}
                page={booksData.pagination.currentPage}
                onChange={(_, newPage) => handlePageChange(newPage)}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Stack>
  )
}
