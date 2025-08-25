import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Chip,
  CircularProgress,
  Alert,
  type SelectChangeEvent
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import './App.css';

interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
}

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from JSON file using API
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API delay for realistic loading experience
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const response = await fetch('/mockExpenses.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: Expense[] = await response.json();
        setExpenses(data);
        setFilteredExpenses(data);
      } catch (err) {
        console.error('Error fetching expenses:', err);
        setError('Failed to load expenses. Please try again later.');
        
        // Fallback to hardcoded data if API fails
        const fallbackData: Expense[] = [
          { id: 1, title: 'Lunch', amount: 1500, category: 'Food', date: '2025-03-25' },
          { id: 2, title: 'Gas Station', amount: 2500, category: 'Transport', date: '2025-03-24' },
          { id: 3, title: 'Movie Tickets', amount: 1200, category: 'Entertainment', date: '2025-03-23' },
          { id: 4, title: 'Grocery Shopping', amount: 3500, category: 'Food', date: '2025-03-22' },
          { id: 5, title: 'Uber Ride', amount: 800, category: 'Transport', date: '2025-03-21' },
          { id: 6, title: 'Coffee', amount: 300, category: 'Food', date: '2025-03-20' },
          { id: 7, title: 'Netflix Subscription', amount: 1500, category: 'Entertainment', date: '2025-03-19' },
          { id: 8, title: 'Bus Fare', amount: 200, category: 'Transport', date: '2025-03-18' },
          { id: 9, title: 'Dinner at Restaurant', amount: 4500, category: 'Food', date: '2025-03-17' },
          { id: 10, title: 'Parking Fee', amount: 500, category: 'Transport', date: '2025-03-16' },
          { id: 11, title: 'Concert Tickets', amount: 8000, category: 'Entertainment', date: '2025-03-15' },
          { id: 12, title: 'Breakfast', amount: 800, category: 'Food', date: '2025-03-14' },
          { id: 13, title: 'Taxi Ride', amount: 1200, category: 'Transport', date: '2025-03-13' },
          { id: 14, title: 'Gym Membership', amount: 2500, category: 'Health', date: '2025-03-12' },
          { id: 15, title: 'Pizza Delivery', amount: 2200, category: 'Food', date: '2025-03-11' },
          { id: 16, title: 'Train Ticket', amount: 1800, category: 'Transport', date: '2025-03-10' },
          { id: 17, title: 'Spotify Premium', amount: 1200, category: 'Entertainment', date: '2025-03-09' },
          { id: 18, title: 'Smoothie', amount: 600, category: 'Food', date: '2025-03-08' },
          { id: 19, title: 'Car Wash', amount: 1500, category: 'Transport', date: '2025-03-07' },
          { id: 20, title: 'Theater Show', amount: 6500, category: 'Entertainment', date: '2025-03-06' }
        ];
        setExpenses(fallbackData);
        setFilteredExpenses(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Get unique categories for filter dropdown
  const categories = ['All', ...Array.from(new Set(expenses.map(expense => expense.category)))];

  // Filter expenses based on category and search term
  useEffect(() => {
    let filtered = expenses;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(expense =>
        expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredExpenses(filtered);
  }, [selectedCategory, searchTerm, expenses]);

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth={false} sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: '100vh'
      }}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
          Loading Expenses...
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Please wait while we fetch your data
        </Typography>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth={false} sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: '100vh'
      }}>
        <Alert severity="error" sx={{ mb: 3, fontSize: '1.1rem' }}>
          {error}
        </Alert>
        <Typography variant="body1" color="text.secondary">
          Using fallback data for demonstration
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
    }}>
      {/* Header Section with Flexbox - Left Aligned */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-start', 
        alignItems: 'center',
        mb: 4,
        width: '100%'
      }}>
        <Typography variant="h2" component="h1" color="primary" sx={{ 
          fontWeight: 700,
          fontSize: '3rem',
          textAlign: 'left'
        }}>
          Expense Viewer
        </Typography>
      </Box>
      
      {/* Filters Section - Using Flexbox */}
      <Paper sx={{ 
        p: 6, 
        mb: 5,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid',
        borderColor: 'divider',
        width: '100%',
        maxWidth: '100%'
      }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 8, 
          flexWrap: 'wrap', 
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%'
        }}>
          <FormControl sx={{ 
            minWidth: 400,
            flex: '1 1 auto',
            '& .MuiOutlinedInput-root': {
              height: '60px',
              borderRadius: 1.5
            },
            '& .MuiInputLabel-root': {
              fontSize: '1rem',
              fontWeight: 500
            }
          }}>
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Filter by Category"
              onChange={handleCategoryChange}
              sx={{ 
                height: '60px',
                fontSize: '1.1rem'
              }}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category} sx={{ fontSize: '1rem' }}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Search by title or category"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1.5, color: 'text.secondary', fontSize: '1.3rem' }} />
            }}
            sx={{ 
              minWidth: 500,
              flex: '2 1 auto',
              '& .MuiOutlinedInput-root': {
                height: '60px',
                fontSize: '1.1rem',
                borderRadius: 1.5
              },
              '& .MuiInputLabel-root': {
                fontSize: '1rem',
                fontWeight: 500
              }
            }}
          />
        </Box>
      </Paper>

     

      {/* Full Screen Expenses Grid */}
      <Box sx={{
        width: '100vw',
        height: 'calc(100vh - 400px)',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        borderTop: '1px solid',
        borderColor: 'divider',
        overflow: 'auto'
      }}>
        {/* Grid Header - Sticky */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '2.5fr 1fr 1fr 1fr',
          gap: 2,
          backgroundColor: 'primary.main',
          color: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          borderBottom: '2px solid',
          borderColor: 'primary.dark',
          p: 1
        }}>
          <Box sx={{
            p: 3,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}>
            <Typography sx={{ fontWeight: 600, fontSize: '1.2rem' }}>Title</Typography>
          </Box>
          <Box sx={{
            p: 3,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography sx={{ fontWeight: 600, fontSize: '1.2rem' }}>Amount</Typography>
          </Box>
          <Box sx={{
            p: 3,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography sx={{ fontWeight: 600, fontSize: '1.2rem' }}>Category</Typography>
          </Box>
          <Box sx={{
            p: 3,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography sx={{ fontWeight: 600, fontSize: '1.2rem' }}>Date</Typography>
          </Box>
        </Box>

        {/* Grid Content */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '2.5fr 1fr 1fr 1fr',
          gap: 2,
          p: 1
        }}>
          {filteredExpenses.map((expense) => (
            <Box key={expense.id} sx={{
              display: 'contents'
            }}>
              {/* Title Column */}
              <Box sx={{
                p: 3,
                minHeight: '100px',
                borderRadius: 1,
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                transition: 'all 0.2s ease',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: '#f8f9fa',
                  borderColor: 'primary.main',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }
              }}>
                <Typography variant="body1" sx={{ 
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  color: 'text.primary'
                }}>
                  {expense.title}
                </Typography>
              </Box>

              {/* Amount Column */}
              <Box sx={{
                p: 3,
                minHeight: '100px',
                borderRadius: 1,
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: '#f8f9fa',
                  borderColor: 'primary.main',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }
              }}>
                <Typography variant="h6" color="primary" fontWeight="bold" sx={{ fontSize: '1.2rem' }}>
                  {formatCurrency(expense.amount)}
                </Typography>
              </Box>

              {/* Category Column */}
              <Box sx={{
                p: 3,
                minHeight: '100px',
                borderRadius: 1,
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: '#f8f9fa',
                  borderColor: 'primary.main',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }
              }}>
                <Chip 
                  label={expense.category} 
                  color="secondary" 
                  variant="outlined"
                  size="medium"
                  sx={{ 
                    fontSize: '0.95rem', 
                    py: 1,
                    px: 2,
                    fontWeight: 500
                  }}
                />
              </Box>

              {/* Date Column */}
              <Box sx={{
                p: 3,
                minHeight: '100px',
                borderRadius: 1,
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: '#f8f9fa',
                  borderColor: 'primary.main',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }
              }}>
                <Typography variant="body1" sx={{ 
                  fontSize: '1rem',
                  color: 'text.secondary',
                  fontWeight: 500
                }}>
                  {formatDate(expense.date)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* No results message */}
      {filteredExpenses.length === 0 && (
        <Paper sx={{ 
          p: 4, 
          mt: 3, 
          textAlign: 'center',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
            No expenses found matching your criteria
          </Typography>
        </Paper>
      )}
       <Typography variant="h6" gutterBottom sx={{ 
        mb: 3,
        fontWeight: 500,
        color: 'text.secondary',
        fontSize: '1.1rem'
      }}>
        Showing {filteredExpenses.length} of {expenses.length} expenses
      </Typography>
    </Container>
  );
}

export default App;
