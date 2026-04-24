import { Box, Typography, Divider } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Users, DollarSign, Ticket, Package } from 'lucide-react';

dayjs.extend(relativeTime);

interface Activity {
  id: string;
  type: 'customer' | 'payment' | 'ticket' | 'package';
  description: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const getIcon = (type: Activity['type']) => {
  switch (type) {
    case 'customer':
      return <Users size={16} className="text-blue-500" />;
    case 'payment':
      return <DollarSign size={16} className="text-green-500" />;
    case 'ticket':
      return <Ticket size={16} className="text-orange-500" />;
    case 'package':
      return <Package size={16} className="text-purple-500" />;
    default:
      return null;
  }
};

export default function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No recent activities
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {activities.slice(0, 8).map((activity, index) => (
        <Box key={activity.id}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              py: 1.5,
            }}
          >
            <Box
              sx={{
                mt: 0.5,
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {getIcon(activity.type)}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ mb: 0.5 }} noWrap>
                {activity.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {dayjs(activity.timestamp).fromNow()}
              </Typography>
            </Box>
          </Box>
          {index < Math.min(activities.length, 8) - 1 && (
            <Divider />
          )}
        </Box>
      ))}
    </Box>
  );
}
