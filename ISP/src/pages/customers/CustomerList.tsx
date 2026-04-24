import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
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
  Checkbox,
} from '@mui/material';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
} from 'lucide-react';
import { useCustomers, useDeleteCustomer, useBulkDeleteCustomers } from '@/hooks/useCustomers';
import { ROUTES } from '@/config/constants';
import { exportToCSV } from '@/utils/csvExport';
import toast from 'react-hot-toast';
import ImportCustomers from '@/components/customers/ImportCustomers';

export default function CustomerList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: customers, isLoading } = useCustomers({
    search: searchTerm,
    status: statusFilter || undefined,
  });

  const deleteMutation = useDeleteCustomer();
  const bulkDeleteMutation = useBulkDeleteCustomers();

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} customers?`)) {
      bulkDeleteMutation.mutate(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleExportCSV = () => {
    const dataToExport = filteredCustomers.map((customer) => ({
      'Customer ID': customer.customerId,
      'Name': customer.fullName,
      'Email': customer.email,
      'Phone': customer.phone,
      'Package': customer.packageName,
      'Status': customer.status,
      'Balance': customer.balance,
      'City': customer.city,
    }));

    exportToCSV(dataToExport, 'customers', [
      { key: 'Customer ID' as any, label: 'Customer ID' },
      { key: 'Name' as any, label: 'Name' },
      { key: 'Email' as any, label: 'Email' },
      { key: 'Phone' as any, label: 'Phone' },
      { key: 'Package' as any, label: 'Package' },
      { key: 'Status' as any, label: 'Status' },
      { key: 'Balance' as any, label: 'Balance' },
      { key: 'City' as any, label: 'City' },
    ]);
    toast.success('Customers exported successfully');
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelectedIds([]);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(paginatedCustomers.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredCustomers = customers || [];
  const paginatedCustomers = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Customer Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your ISP customers and their subscriptions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download size={20} />}
            onClick={handleExportCSV}
            disabled={filteredCustomers.length === 0}
          >
            Export CSV
          </Button>
          <ImportCustomers />
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate(ROUTES.ADD_CUSTOMER)}
            sx={{
              bgcolor: '#FF9800',
              '&:hover': { bgcolor: '#F57C00' },
            }}
          >
            Add Customer
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search customers..."
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
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <Card sx={{ mb: 2, bgcolor: '#EFF6FF', border: '1px solid #3B82F6' }}>
          <CardContent sx={{ py: 1.5 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" fontWeight="medium" color="primary">
                {selectedIds.length} customer(s) selected
              </Typography>
              <Button
                size="small"
                color="error"
                startIcon={<Trash2 size={16} />}
                onClick={handleBulkDelete}
                disabled={bulkDeleteMutation.isPending}
              >
                {bulkDeleteMutation.isPending ? 'Deleting...' : 'Delete Selected'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={paginatedCustomers.length > 0 && selectedIds.length === paginatedCustomers.length}
                    onChange={handleSelectAll}
                    indeterminate={selectedIds.length > 0 && selectedIds.length < paginatedCustomers.length}
                  />
                </TableCell>
                <TableCell><Typography fontWeight="bold">Customer ID</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Name</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Email</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Phone</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Package</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
                <TableCell align="right"><Typography fontWeight="bold">Actions</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from(new Array(rowsPerPage)).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from(new Array(7)).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginatedCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No customers found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCustomers.map((customer) => (
                  <TableRow key={customer.id} hover selected={selectedIds.includes(customer.id)}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(customer.id)}
                        onChange={() => handleSelectRow(customer.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="medium">{customer.customerId}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="medium">{customer.fullName}</Typography>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.packageName}</TableCell>
                    <TableCell>
                      <Chip
                        label={customer.status}
                        color={getStatusColor(customer.status) as any}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/customers/${customer.id}`)}
                        >
                          <Eye size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/customers/${customer.id}/edit`)}
                        >
                          <Edit size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(customer.id, customer.fullName)}
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
          count={filteredCustomers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Card>
    </Box>
  );
}
