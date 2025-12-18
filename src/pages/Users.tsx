import React, { useEffect, useMemo, useState } from "react";
import {
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
  Box,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  Chip,
  Divider,
  alpha,
  Fade,
  Avatar,
  IconButton,
  Tooltip,
  Skeleton,
} from "@mui/material";
import { Search, Plus, UserPlus, Users as UsersIcon, Edit, Save } from "lucide-react";
import { User } from "@/Types/types";
import { useUsersStore } from "./usersStore";
import { useForm } from "react-hook-form";
import PageHeader from "@/components/PageHeader";

function Users() {
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const { users, addUser, fetchUsers, loading } = useUsersStore((state) => state);

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
    () =>
      users.filter((user) =>
        user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [users, searchQuery]
  );

  const submitHandler = (data: any) => {
    addUser(data);
    reset();
  };

  return (
    <Fade in timeout={300}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <PageHeader
          title="Users"
          subtitle="Manage system users and permissions"
          icon={<UsersIcon size={24} />}
          badge={users.length}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "350px 1fr" },
            gap: 3,
          }}
        >
          {/* Add User Form */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              height: "fit-content",
            }}
          >
            <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                }}
              >
                <UserPlus size={18} />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Add New User
              </Typography>
            </Stack>

            <form onSubmit={handleSubmit(submitHandler)}>
              <Stack spacing={2}>
                <TextField
                  label="Full Name"
                  size="small"
                  {...register("name", { required: true })}
                  error={!!errors.name}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
                <TextField
                  label="Username"
                  size="small"
                  {...register("username", { required: true })}
                  error={!!errors.username}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
                <TextField
                  label="Password"
                  type="password"
                  size="small"
                  {...register("password", { required: true })}
                  error={!!errors.password}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  size="small"
                  {...register("password_confirmation", { required: true })}
                  error={!!errors.password_confirmation}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save size={18} />}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    py: 1.25,
                    boxShadow: "none",
                    "&:hover": { boxShadow: "none" },
                  }}
                >
                  Add User
                </Button>
              </Stack>
            </form>
          </Paper>

          {/* Users List */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 2.5, borderBottom: "1px solid", borderColor: "divider" }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                gap={2}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  All Users
                </Typography>
                <TextField
                  size="small"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    minWidth: 200,
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={18} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Box>

            <Box sx={{ maxHeight: 500, overflowY: "auto" }}>
              {loading ? (
                <Stack spacing={0}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        p: 2,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Skeleton variant="circular" width={40} height={40} />
                      <Skeleton variant="text" width="40%" />
                    </Box>
                  ))}
                </Stack>
              ) : filteredUsers.length === 0 ? (
                <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
                  <UsersIcon size={48} strokeWidth={1.5} style={{ opacity: 0.3, marginBottom: 12 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    No users found
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {searchQuery ? "Try a different search" : "Add your first user"}
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {filteredUsers.map((user) => (
                    <ListItem
                      key={user.id}
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        "&:hover": {
                          bgcolor: (theme) => alpha(theme.palette.action.hover, 0.04),
                        },
                      }}
                      secondaryAction={
                        <Tooltip title="Edit User">
                          <IconButton
                            onClick={() => setSelectedUser(user)}
                            size="small"
                            sx={{
                              color: "text.secondary",
                              "&:hover": {
                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                                color: "primary.main",
                              },
                            }}
                          >
                            <Edit size={18} />
                          </IconButton>
                        </Tooltip>
                      }
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          mr: 2,
                          bgcolor: "primary.main",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                        }}
                      >
                        {user.username?.[0]?.toUpperCase() || "U"}
                      </Avatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {user.username}
                          </Typography>
                        }
                        secondary={user.name || "No name provided"}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Fade>
  );
}

export default Users;
