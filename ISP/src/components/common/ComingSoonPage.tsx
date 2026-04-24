import { Box, Typography, Card, CardContent } from '@mui/material';
import { LucideIcon } from 'lucide-react';

interface ComingSoonPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function ComingSoonPage({ title, description, icon: Icon }: ComingSoonPageProps) {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {description}
      </Typography>

      <Card>
        <CardContent>
          <Box
            sx={{
              minHeight: 400,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.50',
              borderRadius: 2,
            }}
          >
            <Icon size={64} color="#FF9800" style={{ marginBottom: 16 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {title} Module
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This feature is under development and will be available soon.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
