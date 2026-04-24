import { Box, Button, Grid } from '@mui/material';
import { UserPlus, FileText, Ticket, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/constants';

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Add Customer',
      icon: UserPlus,
      color: '#3B82F6',
      route: ROUTES.ADD_CUSTOMER,
    },
    {
      label: 'Generate Bills',
      icon: FileText,
      color: '#10B981',
      route: ROUTES.GENERATE_BILLS,
    },
    {
      label: 'Create Ticket',
      icon: Ticket,
      color: '#F59E0B',
      route: ROUTES.TICKETS,
    },
    {
      label: 'View Reports',
      icon: BarChart3,
      color: '#8B5CF6',
      route: ROUTES.REPORTS,
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2}>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Grid item xs={6} sm={3} key={action.label}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate(action.route)}
                sx={{
                  py: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  gap: 1.5,
                  borderColor: action.color,
                  color: action.color,
                  '&:hover': {
                    borderColor: action.color,
                    bgcolor: `${action.color}08`,
                  },
                }}
                startIcon={<Icon size={20} />}
              >
                {action.label}
              </Button>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
