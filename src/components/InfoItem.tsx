import { Typography, Box, Paper } from '@mui/material';
import React from 'react'
interface infoItemProps {
    name:string;
    value:number;
    InfoIcon:React.FC<React.SVGProps<SVGSVGElement>>;
    moneyTxt:boolean;
    decimalPoins?:number; // for currency, default is 3 decimal points.
}
function InfoItem({name,value,InfoIcon,moneyTxt,decimalPoins=3}:infoItemProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        background: 'linear-gradient(45deg, #7bc7d4, transparent)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant='h5' sx={{ fontWeight: 500, color: 'text.secondary' }}>{name}</Typography>
          <Typography variant='h4' sx={{ mt: 1, fontWeight: 600, color: 'text.primary' }}>
            {value.toFixed(decimalPoins)}
          </Typography>
        </Box>
        <Box sx={{ bgcolor: 'indigo.50', p: 1.5, borderRadius: '50%' }}>
          {moneyTxt ? 'OMR':  <InfoIcon style={{ height: 24, width: 24, color: '#4f46e5' }} />}
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        {/* <span className="text-sm font-medium text-green-600">0</span> */}
        {/* <span className="text-sm text-gray-500"> from last month</span> */}
      </Box>
    </Paper>
  )
}

export default InfoItem