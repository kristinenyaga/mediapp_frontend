import { Box, LinearProgress } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingScreen = () => {
  return (
    <Box sx={{ padding: "20%", marginX: "auto" }}>
      <LinearProgress color="primary" />
    </Box>
  )
}

export const CircularLoading = () => <Box sx={{ display: 'flex' }}>
  <CircularProgress color='primary' />
</Box>


export default LoadingScreen