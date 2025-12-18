import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Stack,
  alpha,
  Fade,
  Chip,
  Skeleton,
  Alert,
  CircularProgress,
  Button,
} from "@mui/material";
import { ArrowLeft, Plus, Check, Image as ImageIcon } from "lucide-react";
import axiosClient from "@/helpers/axios-client";
import { webUrl } from "@/helpers/constants";

interface CategoryGallaryProps {
  selectedCategory: { id: number; name: string; image_url: string } | null;
  setShowImageGallary: (show: boolean) => void;
  fetchCategories: () => void;
}

export default function CategoryGallary({
  selectedCategory,
  setShowImageGallary,
  fetchCategories,
}: CategoryGallaryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    setUploading(true);
    const uploadPromises = files
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => {
        const formData = new FormData();
        formData.append("image", file);

        return axiosClient.post(
          `categories/${selectedCategory?.id}/upload-image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      });

    Promise.all(uploadPromises)
      .then(() => {
        fetchImages();
        setError(null);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        setError("Failed to upload image");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get("fileNames");
      setImages(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching images:", err);
      setError("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = async (imageName: string) => {
    if (!selectedCategory) {
      console.error("No category selected");
      return;
    }

    try {
      setSelectedImage(imageName);
      setLoading(true);

      await axiosClient.patch(`categories/${selectedCategory.id}/image-url`, {
        image_url: imageName,
      });

      setShowImageGallary(false);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category image:", error);
      setError("Failed to update category image");
      setSelectedImage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in timeout={300}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
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
            alignItems={{ xs: "flex-start", sm: "center" }}
            gap={2}
          >
            <Stack direction="row" alignItems="center" gap={2}>
              <IconButton
                onClick={() => setShowImageGallary(false)}
                sx={{
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.1),
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.2),
                  },
                }}
              >
                <ArrowLeft size={20} />
              </IconButton>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Select Image
                </Typography>
                <Stack direction="row" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    For category:
                  </Typography>
                  <Chip
                    label={selectedCategory?.name || "Unknown"}
                    size="small"
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                </Stack>
              </Box>
            </Stack>

            {/* Upload Button */}
            <Button
              component="label"
              variant="contained"
              startIcon={uploading ? <CircularProgress size={18} color="inherit" /> : <Plus size={18} />}
              disabled={uploading}
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
              {uploading ? "Uploading..." : "Upload New"}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                style={{ display: "none" }}
              />
            </Button>
          </Stack>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* Gallery Grid */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                color: "info.main",
              }}
            >
              <ImageIcon size={20} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Image Gallery
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {images.length} images available
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(5, 1fr)",
              },
              gap: 2,
            }}
          >
            {loading && images.length === 0 ? (
              // Loading skeleton
              Array.from({ length: 8 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  sx={{
                    aspectRatio: "1",
                    borderRadius: 2,
                  }}
                />
              ))
            ) : images.length === 0 ? (
              <Box
                sx={{
                  gridColumn: "1 / -1",
                  py: 8,
                  textAlign: "center",
                  border: "2px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <ImageIcon
                  size={48}
                  strokeWidth={1.5}
                  style={{ opacity: 0.3, marginBottom: 12 }}
                />
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  No images found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Upload some images to get started
                </Typography>
              </Box>
            ) : (
              images.map((image) => {
                const isSelected = selectedImage === image;
                const isCurrent = selectedCategory?.image_url === image;

                return (
                  <Box
                    key={image}
                    onClick={() => !isSelected && handleImageSelect(image)}
                    sx={{
                      position: "relative",
                      aspectRatio: "1",
                      borderRadius: 2,
                      overflow: "hidden",
                      cursor: isSelected ? "default" : "pointer",
                      border: "2px solid",
                      borderColor: isCurrent
                        ? "primary.main"
                        : isSelected
                        ? "success.main"
                        : "transparent",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: isCurrent
                          ? "primary.main"
                          : isSelected
                          ? "success.main"
                          : "primary.light",
                        transform: isSelected ? "none" : "scale(1.02)",
                        "& .overlay": {
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={`${webUrl}/images/${image}`}
                      alt={image}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />

                    {/* Hover Overlay */}
                    <Box
                      className="overlay"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        bgcolor: isSelected
                          ? alpha("#000", 0.5)
                          : alpha("#000", 0),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: isSelected ? 1 : 0,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: alpha("#000", 0.4),
                        },
                      }}
                    >
                      {isSelected ? (
                        <CircularProgress size={24} sx={{ color: "white" }} />
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            px: 2,
                            py: 0.5,
                            bgcolor: alpha("#000", 0.5),
                            borderRadius: 1,
                          }}
                        >
                          Select
                        </Typography>
                      )}
                    </Box>

                    {/* Current Image Badge */}
                    {isCurrent && (
                      <Chip
                        icon={<Check size={14} />}
                        label="Current"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          bgcolor: "primary.main",
                          color: "white",
                          fontWeight: 600,
                          fontSize: "0.65rem",
                          height: 24,
                          "& .MuiChip-icon": {
                            color: "white",
                          },
                        }}
                      />
                    )}
                  </Box>
                );
              })
            )}

            {/* Upload Card */}
            {!loading && (
              <Box
                component="label"
                sx={{
                  aspectRatio: "1",
                  borderRadius: 2,
                  border: "2px dashed",
                  borderColor: "divider",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
                  },
                }}
              >
                <Plus size={24} style={{ opacity: 0.5, marginBottom: 8 }} />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  Add Image
                </Typography>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  style={{ display: "none" }}
                />
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
}
