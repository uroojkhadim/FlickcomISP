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
} from '@mui/material';
import {
  Search,
  Edit,
  Trash2,
  Filter,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { usePackages, useDeletePackage, useTogglePackageStatus } from '@/hooks/usePackages';
import { formatCurrency } from '@/utils/formatters';

export default function PackageList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: packages, isLoading } = usePackages({
    search: searchTerm,
    status: statusFilter || undefined,
  });

  const deleteMutation = useDeletePackage();
  const toggleMutation = useTogglePackageStatus();

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    toggleMutation.mutate({ id, status: newStatus });
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredPackages = packages || [];
  const paginatedPackages = filteredPackages.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Package Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage internet packages and pricing plans
          </Typography>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search packages..."
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
                <TableCell><Typography fontWeight="bold">Package Name</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Speed</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Price</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Billing Cycle</Typography></TableCell>
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
              ) : paginatedPackages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No packages found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPackages.map((pkg) => (
                  <TableRow key={pkg.id} hover>
                    <TableCell>
                      <Box>
                        <Typography fontWeight="medium">{pkg.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {pkg.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography>{pkg.speed.download} Mbps</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ↓ / {pkg.speed.upload} Mbps ↑
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" color="primary">
                        {formatCurrency(pkg.price)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        /{pkg.billingCycle}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ textTransform: 'capitalize' }}>
                        {pkg.billingCycle}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={pkg.status}
                        color={pkg.status === 'active' ? 'success' : 'default'}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={pkg.status === 'active' ? 'Deactivate' : 'Activate'}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleStatus(pkg.id, pkg.status)}
                        >
                          {pkg.status === 'active' ? (
                            <ToggleRight size={20} className="text-green-600" />
                          ) : (
                            <ToggleLeft size={20} className="text-gray-400" />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small">
                          <Edit size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(pkg.id, pkg.name)}
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
          count={filteredPackages.length}
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
