import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
  Box,
  Card,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Search } from 'lucide-react';
import { User } from '@/Types/types';
import { useUsersStore } from './usersStore';
import Grid from '@mui/material/Grid';
import { useForm } from 'react-hook-form';

function Users() {
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const { users,addUser,fetchUsers,currentUser} = useUsersStore((state)=>state);


   const {handleSubmit,formState:{errors},register }= useForm()
   const SubmitHandler = (data)=>{
    console.log(data)
    addUser(data)
   }

  const filteredUsers = users.filter(
    (user) =>
      user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) 
  );
  useEffect(()=>{
    fetchUsers()
  },[])
  return (
    <Grid spacing={1} container sx={{ py: 4 }}>
      <Grid  xs={12} lg={3} item >
                <Typography textAlign={'center'} variant='h4'>Add User</Typography>

        <Card sx={{p:1}}>
            <form onSubmit={handleSubmit(SubmitHandler)}>
                <Stack gap={1} direction={'column'}>
                    <TextField label='name' {...register('name')}/>
                    <TextField label='username' {...register('username')}/>
                    <TextField label='password' {...register('password')}/>
                    <TextField label='confirm password' {...register('password_confirmation')}/>
                    <Button type='submit'>Add User</Button>
                </Stack>
            </form>
        </Card>

      
      </Grid>
      <Grid component={Card} sx={{p:1}} xs={12} lg={3} item>
      <Typography className='bg-slate-400 rounded-md' textAlign={'center'} variant='h4'> Users</Typography>

        <List >
          {filteredUsers.map((user) => (
            <ListItem className='hover:bg-amber-100' key={user.id}>
              <ListItemText primary={user.username} />
              <Button
                onClick={() => setSelectedUser(user)}
                variant="contained"
                color="primary"
              >
                Edit
              </Button>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}

export default Users;