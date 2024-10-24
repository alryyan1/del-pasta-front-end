import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/stateContext';
import axiosClient from '@/helpers/axios-client';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';

export default function ButtonAppBar() {
    const navigate = useNavigate()
    const {authenticate,user,setUser} = useAuthContext()
    const [loading,setLoading] = useState<boolean>()
    const logoutHandler = () => {

        setLoading(true);
        console.log('navigate to to login');
        axiosClient
          .post("logout")
          .then(() => {
            authenticate(null);
            setUser(null);
            localStorage.clear()
            navigate('/login')
        
          })
          .finally(() => setLoading(false));
      };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ gap: 2 }}>
          <LoadingButton
             onClick={logoutHandler}
            loading={loading}
            size="large"
            edge="start"
            color="inherit"
            aria-label="logout"
            sx={{ mr: 2 }}
          >
            <LogoutIcon />
          </LoadingButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          </Typography>
          <Link
            to={'/orders'}
            color="inherit"
            className='bg-blue-500 text-white text-lg px-4 py-2 rounded hover:bg-blue-700'
          >
            الطلبات
          </Link>
          <Link
            to={'/makeOrder'}
            color="inherit"
            className='bg-blue-500 text-white text-lg px-4 py-2 rounded hover:bg-blue-700'
          >
            طلب جديد
          </Link>
          <Link
            to={'/config'}
            color="inherit"
            className='bg-blue-500 text-white text-lg px-4 py-2 rounded hover:bg-blue-700'
          >
             الاعدادات
          </Link>
          <Link
            to={'/meals'}
            color="inherit"
            className='bg-blue-500 text-white text-lg px-4 py-2 rounded hover:bg-blue-700'
          >
             الوجبات
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}