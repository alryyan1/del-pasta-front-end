import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  alpha,
  Fade,
  IconButton,
} from "@mui/material";
import { Settings as SettingsIcon, Upload, Save, Image, X } from "lucide-react";
import axiosClient from "@/helpers/axios-client";
import PageHeader from "@/components/PageHeader";

interface SettingsData {
  id?: number;
  header_base64?: string;
  footer_base64?: string;
  is_header?: number;
  is_footer?: number;
  is_logo?: number;
  kitchen_name?: string;
  currency?: string;
  inventory_notification_number?: string;
  vatin?: string;
  cr?: string;
  email?: string;
  address?: string;
  header_content?: string;
  footer_content?: string;
}

function encodeImageFileAsURL(
  file: File,
  colName: string,
  callback: () => void
) {
  const reader = new FileReader();
  reader.onloadend = function () {
    saveToDb(colName, reader.result as string);
    callback();
  };
  reader.readAsDataURL(file);
}

const saveToDb = (colName: string, data: string | boolean) => {
  axiosClient.post("settings", { colName, data });
};

function Settings() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [welcomeMsg, setWelcomeMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("settings")
      .then(({ data }) => {
        setSettings(data);
        setWelcomeMsg(data?.header_content || "");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    colName: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      encodeImageFileAsURL(file, colName, () => {
        // Refresh settings after upload
        axiosClient.get("settings").then(({ data }) => setSettings(data));
      });
    }
  };

  return (
    <Fade in timeout={300}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <PageHeader
          title="Settings"
          subtitle="Configure your application settings"
          icon={<SettingsIcon size={24} />}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr 1fr" },
            gap: 3,
          }}
        >
          {/* Images Section */}
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
                <Image size={18} />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Receipt Images
              </Typography>
            </Stack>

            <Stack spacing={3}>
              {/* Header Image */}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                  Header Image
                </Typography>
                <Box
                  component="label"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 120,
                    border: "2px dashed",
                    borderColor: "divider",
                    borderRadius: 2,
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
                    },
                  }}
                >
                  {settings?.header_base64 ? (
                    <Box
                      component="img"
                      src={settings.header_base64}
                      alt="Header"
                      sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    <>
                      <Upload size={24} style={{ opacity: 0.5, marginBottom: 8 }} />
                      <Typography variant="caption" color="text.secondary">
                        Click to upload
                      </Typography>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "header_base64")}
                    style={{ display: "none" }}
                  />
                </Box>
              </Box>

              {/* Footer Image */}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                  Footer Image
                </Typography>
                <Box
                  component="label"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 120,
                    border: "2px dashed",
                    borderColor: "divider",
                    borderRadius: 2,
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
                    },
                  }}
                >
                  {settings?.footer_base64 ? (
                    <Box
                      component="img"
                      src={settings.footer_base64}
                      alt="Footer"
                      sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    <>
                      <Upload size={24} style={{ opacity: 0.5, marginBottom: 8 }} />
                      <Typography variant="caption" color="text.secondary">
                        Click to upload
                      </Typography>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "footer_base64")}
                    style={{ display: "none" }}
                  />
                </Box>
              </Box>
            </Stack>
          </Paper>

          {/* General Settings */}
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
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                  color: "info.main",
                }}
              >
                <SettingsIcon size={18} />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                General Settings
              </Typography>
            </Stack>

            <Stack spacing={2}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings?.is_header === 1}
                      onChange={(e) =>
                        saveToDb("is_header", e.target.checked)
                      }
                      size="small"
                    />
                  }
                  label="Show Header"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings?.is_footer === 1}
                      onChange={(e) =>
                        saveToDb("is_footer", e.target.checked)
                      }
                      size="small"
                    />
                  }
                  label="Show Footer"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings?.is_logo === 1}
                      onChange={(e) =>
                        saveToDb("is_logo", e.target.checked)
                      }
                      size="small"
                    />
                  }
                  label="Show Logo"
                />
              </FormGroup>

              <Divider />

              <TextField
                label="Business Name"
                size="small"
                defaultValue={settings?.kitchen_name}
                onChange={(e) => saveToDb("kitchen_name", e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                label="Currency"
                size="small"
                defaultValue={settings?.currency}
                onChange={(e) => saveToDb("currency", e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                label="Notification Phone"
                size="small"
                defaultValue={settings?.inventory_notification_number}
                onChange={(e) =>
                  saveToDb("inventory_notification_number", e.target.value)
                }
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                label="VAT Number"
                size="small"
                defaultValue={settings?.vatin}
                onChange={(e) => saveToDb("vatin", e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                label="CR Number"
                size="small"
                defaultValue={settings?.cr}
                onChange={(e) => saveToDb("cr", e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                label="Email"
                size="small"
                defaultValue={settings?.email}
                onChange={(e) => saveToDb("email", e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                label="Address"
                size="small"
                defaultValue={settings?.address}
                onChange={(e) => saveToDb("address", e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Stack>
          </Paper>

          {/* Content Section */}
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
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
              Receipt Content
            </Typography>

            <Stack spacing={3}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                  Welcome Message
                </Typography>
                <TextField
                  multiline
                  rows={5}
                  fullWidth
                  value={welcomeMsg}
                  onChange={(e) => setWelcomeMsg(e.target.value)}
                  placeholder="Enter welcome message for receipts..."
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Save size={18} />}
                  onClick={() => {
                    saveToDb("header_content", welcomeMsg);
                  }}
                  sx={{
                    mt: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": { boxShadow: "none" },
                  }}
                >
                  Save Message
                </Button>
              </Box>

              <Divider />

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                  Footer Content
                </Typography>
                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  defaultValue={settings?.footer_content}
                  onChange={(e) => saveToDb("footer_content", e.target.value)}
                  placeholder="Enter footer content..."
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Fade>
  );
}

export default Settings;
