import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Tooltip,
  Skeleton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  Filter,
  DollarSign,
  CheckCircle,
  Trash2,
} from 'lucide-react';
import { useBills, useMarkAsPaid, useDeleteBill } from '@/hooks/useBilling';
import { formatCurrency, formatDate } from '@/utils/formatters';

export default function BillingDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paymentDialog, setPaymentDialog] = useState<{ open: boolean; billId: string }>({
    open: false,
    billId: '',
  });

  const { data: bills, isLoading } = useBills({
    search: searchTerm,
    status: statusFilter || undefined,
  });

  const markAsPaidMutation = useMarkAsPaid();
  const deleteMutation = useDeleteBill();

  const handleMarkAsPaid = (id: string) => {
    markAsPaidMutation.mutate({ id, paymentMethod: 'cash' });
    setPaymentDialog({ open: false, billId: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredBills = bills || [];
  const paginatedBills = filteredBills.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Calculate summary
  const totalRevenue = filteredBills
    .filter((b) => b.status === 'paid')
    .reduce((sum, b) => sum + b.amount, 0);
  const totalPending = filteredBills
    .filter((b) => b.status === 'pending' || b.status === 'overdue')
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Billing Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage bills, payments, and invoices
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200, bgcolor: '#F0FDF4' }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Box p={1.5} borderRadius={2} bgcolor="success.main" color="white">
                <DollarSign size={24} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Total Revenue
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {formatCurrency(totalRevenue)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200, bgcolor: '#FEF3C7' }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Box p={1.5} borderRadius={2} bgcolor="warning.main" color="white">
                <DollarSign size={24} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Pending Amount
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="warning.main">
                  {formatCurrency(totalPending)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search bills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 1, minWidth: 250 }}
              InputProps={{
                startAdornment: <Search size={20} style={{ marginRight: 8, color: '#9CA3AF' }} />,
              }}
              size="small"
            />
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                startAdornment={<Filter size={16} style={{ marginRight: 8 }} />}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                <TableCell><Typography fontWeight="bold">Invoice #</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Customer</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Amount</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Due Date</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
                <TableCell align="right"><Typography fontWeight="bold">Actions</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from(new Array(rowsPerPage)).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from(new Array(6)).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginatedBills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No bills found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBills.map((bill) => (
                  <TableRow key={bill.id} hover>
                    <TableCell>
                      <Typography fontWeight="medium">{bill.invoiceNumber}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {bill.billingPeriod}
                      </Typography>
                    </TableCell>
                    <TableCell>{bill.customerName}</TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">{formatCurrency(bill.amount)}</Typography>
                    </TableCell>
                    <TableCell>{formatDate(bill.dueDate)}</TableCell>
                    <TableCell>
                      <Chip
                        label={bill.status}
                        color={getStatusColor(bill.status) as any}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {bill.status !== 'paid' && (
                        <Tooltip title="Mark as Paid">
                          <IconButton
                            size="small"
                            onClick={() => setPaymentDialog({ open: true, billId: bill.id })}
                            color="success"
                          >
                            <CheckCircle size={18} />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(bill.id)}
                          color="error"
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredBills.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Card>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog.open} onClose={() => setPaymentDialog({ open: false, billId: '' })}>
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <Typography>Mark this bill as paid?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialog({ open: false, billId: '' })}>Cancel</Button>
          <Button
            onClick={() => handleMarkAsPaid(paymentDialog.billId)}
            variant="contained"
            color="success"
          >
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
