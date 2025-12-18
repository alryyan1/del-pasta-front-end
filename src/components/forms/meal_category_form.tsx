import { useEffect, useState } from "react";
import { useCategoryStore } from "@/stores/CategoryStore";
import {
  Dialog,
  DialogContent,
  Switch,
  IconButton,
  Tooltip,
  Button,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Stack,
  Avatar,
  alpha,
  Fade,
  Skeleton,
} from "@mui/material";
import {
  Settings,
  Plus,
  Image as ImageIcon,
  FolderOpen,
  X,
  Upload,
  Save,
} from "lucide-react";
import CategoryGallary from "@/pages/CategoryGallary";
import { webUrl } from "@/helpers/constants";
import { Category } from "@/Types/types";

const MealCategoryForm = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const {
    fetchCategories,
    categories,
    add,
    updateVisibility,
    updateOrder,
    loading,
  } = useCategoryStore((state) => state);
  const [showGallary, setShowGallary] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName || !categoryImage) {
      return;
    }

    setIsSubmitting(true);
    add(categoryName, previewImage || "");

    setTimeout(() => {
      setCategoryName("");
      setCategoryImage(null);
      setPreviewImage(null);
      setShowAddDialog(false);
      setIsSubmitting(false);
    }, 500);
  };

  const handleVisibilityToggle = (
    categoryId: number,
    currentVisibility: boolean
  ) => {
    updateVisibility(categoryId, !currentVisibility);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (showGallary) {
    return (
      <CategoryGallary
        fetchCategories={fetchCategories}
        setShowImageGallary={setShowGallary}
        selectedCategory={selectedCategory}
      />
    );
  }

  return (
    <Fade in timeout={300}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Page Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              mb: 0.5,
            }}
          >
            Categories Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your menu categories, visibility, and display order
          </Typography>
        </Box>

        {/* Action Bar */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            gap={2}
          >
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                }}
              >
                <FolderOpen size={20} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  All Categories
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {categories.length} categories total
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => setShowAddDialog(true)}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
              }}
            >
              Add Category
            </Button>
          </Stack>
        </Paper>

        {/* Categories Table */}
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
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.grey[100], 0.8),
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      py: 1.5,
                      width: 100,
                    }}
                  >
                    Image
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      py: 1.5,
                    }}
                  >
                    Category Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      py: 1.5,
                      width: 120,
                      textAlign: "center",
                    }}
                  >
                    Order
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      py: 1.5,
                      width: 120,
                      textAlign: "center",
                    }}
                  >
                    Visibility
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      py: 1.5,
                      width: 100,
                      textAlign: "center",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton
                          variant="rounded"
                          width={64}
                          height={64}
                          sx={{ borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" width="60%" />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          variant="rounded"
                          width={60}
                          height={32}
                          sx={{ mx: "auto" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          variant="rounded"
                          width={50}
                          height={24}
                          sx={{ mx: "auto" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          variant="circular"
                          width={32}
                          height={32}
                          sx={{ mx: "auto" }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Box
                        sx={{
                          py: 8,
                          textAlign: "center",
                          color: "text.secondary",
                        }}
                      >
                        <FolderOpen
                          size={48}
                          strokeWidth={1.5}
                          style={{ opacity: 0.3, marginBottom: 16 }}
                        />
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          No categories yet
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          Create your first category to get started
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((cat) => (
                    <TableRow
                      key={cat.id}
                      sx={{
                        transition: "background-color 0.15s ease",
                        "&:hover": {
                          bgcolor: (theme) =>
                            alpha(theme.palette.action.hover, 0.04),
                        },
                      }}
                    >
                      <TableCell sx={{ py: 1.5 }}>
                        {cat.image_url ? (
                          <Box
                            component="img"
                            src={`${webUrl}/images/${cat.image_url}`}
                            alt={cat.name}
                            sx={{
                              width: 64,
                              height: 64,
                              objectFit: "cover",
                              borderRadius: 2,
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          />
                        ) : (
                          <Avatar
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: 2,
                              bgcolor: (theme) =>
                                alpha(theme.palette.grey[500], 0.1),
                              color: "text.secondary",
                            }}
                          >
                            <ImageIcon size={24} />
                          </Avatar>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: "text.primary",
                          }}
                        >
                          {cat.name}
                        </Typography>
                        {cat.meals && (
                          <Typography variant="caption" color="text.secondary">
                            {cat.meals.length} items
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={cat.order_id || 0}
                          onChange={(e) =>
                            updateOrder(cat.id, parseInt(e.target.value) || 0)
                          }
                          sx={{
                            width: 70,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 1.5,
                            },
                            "& input": {
                              textAlign: "center",
                              py: 0.75,
                            },
                          }}
                          inputProps={{ min: 0 }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Switch
                          checked={cat.is_visible !== false}
                          onChange={() =>
                            handleVisibilityToggle(cat.id, cat.is_visible ?? true)
                          }
                          color="primary"
                          size="small"
                        />
                        <Typography
                          variant="caption"
                          display="block"
                          color={
                            cat.is_visible !== false
                              ? "success.main"
                              : "text.secondary"
                          }
                          sx={{ fontWeight: 500 }}
                        >
                          {cat.is_visible !== false ? "Visible" : "Hidden"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Tooltip title="Select Image">
                          <IconButton
                            onClick={() => {
                              setSelectedCategory(cat);
                              setShowGallary(true);
                            }}
                            size="small"
                            sx={{
                              color: "text.secondary",
                              "&:hover": {
                                bgcolor: (theme) =>
                                  alpha(theme.palette.primary.main, 0.1),
                                color: "primary.main",
                              },
                            }}
                          >
                            <Settings size={18} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Add Category Dialog */}
        <Dialog
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: "hidden",
            },
          }}
        >
          {/* Dialog Header */}
          <Box
            sx={{
              px: 3,
              py: 2.5,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03),
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                }}
              >
                <Plus size={20} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                  }}
                >
                  Add New Category
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Create a new menu category
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={() => setShowAddDialog(false)}
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": {
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                  color: "error.main",
                },
              }}
            >
              <X size={20} />
            </IconButton>
          </Box>

          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* Category Name Input */}
                <TextField
                  label="Category Name"
                  placeholder="Enter category name..."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  fullWidth
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                {/* Image Upload */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1.5, fontWeight: 600 }}
                  >
                    Category Image
                  </Typography>

                  {previewImage ? (
                    <Box sx={{ position: "relative" }}>
                      <Box
                        component="img"
                        src={previewImage}
                        alt="Preview"
                        sx={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      />
                      <IconButton
                        onClick={() => {
                          setPreviewImage(null);
                          setCategoryImage(null);
                        }}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "background.paper",
                          boxShadow: 1,
                          "&:hover": {
                            bgcolor: "error.light",
                            color: "white",
                          },
                        }}
                      >
                        <X size={16} />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box
                      component="label"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 160,
                        border: "2px dashed",
                        borderColor: "divider",
                        borderRadius: 2,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.02),
                        },
                      }}
                    >
                      <Upload
                        size={32}
                        strokeWidth={1.5}
                        style={{ opacity: 0.5, marginBottom: 8 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Click to upload image
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        PNG, JPG up to 5MB
                      </Typography>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                        required
                      />
                    </Box>
                  )}
                </Box>
              </Stack>
            </DialogContent>

            {/* Dialog Footer */}
            <Box
              sx={{
                px: 3,
                py: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                bgcolor: (theme) => alpha(theme.palette.grey[100], 0.5),
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
              }}
            >
              <Button
                onClick={() => setShowAddDialog(false)}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  px: 3,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || !categoryName || !categoryImage}
                startIcon={<Save size={18} />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
              >
                {isSubmitting ? "Saving..." : "Add Category"}
              </Button>
            </Box>
          </form>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default MealCategoryForm;
