import React, { useEffect, useMemo, useState } from "react";
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
  InputAdornment,
  Chip,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Search } from "lucide-react";
import { User } from "@/Types/types";
import { useUsersStore } from "./usersStore";
import { useForm } from "react-hook-form";

function Users() {
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const { users, addUser, fetchUsers } = useUsersStore((state) => state);

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(
    () => users.filter((user) => user?.username?.toLowerCase().includes(searchQuery.toLowerCase())),
    [users, searchQuery]
  );

  const SubmitHandler = (data) => {
    addUser(data);
    reset();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Grid spacing={2} container>
        <Grid xs={12} lg={4} item>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              height: "100%",
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Add User
              </Typography>
              <form onSubmit={handleSubmit(SubmitHandler)}>
                <Stack gap={1.5} direction={"column"}>
                  <TextField label="Name" {...register("name", { required: true })} />
                  <TextField label="Username" {...register("username", { required: true })} />
                  <TextField label="Password" type="password" {...register("password", { required: true })} />
                  <TextField
                    label="Confirm password"
                    type="password"
                    {...register("password_confirmation", { required: true })}
                  />
                  <Button type="submit" variant="contained" sx={{ textTransform: "none" }}>
                    Add User
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Paper>
        </Grid>

        <Grid xs={12} lg={8} item>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              height: "100%",
            }}
          >
            <Stack spacing={2}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                gap={1.5}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Users
                </Typography>
                <Chip label={`Total: ${users.length}`} color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
              </Stack>

              <TextField
                size="small"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} className="text-gray-500" />
                    </InputAdornment>
                  ),
                }}
              />

              <Divider />

              <Card variant="outlined" sx={{ borderRadius: 2, maxHeight: 420, overflowY: "auto" }}>
                <List dense>
                  {filteredUsers.length === 0 && (
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.secondary">
                            No users found.
                          </Typography>
                        }
                      />
                    </ListItem>
                  )}
                  {filteredUsers.map((user) => (
                    <ListItem
                      key={user.id}
                      secondaryAction={
                        <Button
                          onClick={() => setSelectedUser(user)}
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{ textTransform: "none" }}
                        >
                          Edit
                        </Button>
                      }
                      divider
                    >
                      <ListItemText primary={user.username} />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Users;