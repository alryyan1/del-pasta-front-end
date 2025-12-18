import React from "react";
import { Box, Typography, Stack, Chip, Button, alpha } from "@mui/material";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  action?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  icon,
  badge,
  action,
  children,
}: PageHeaderProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}
      >
        <Stack direction="row" alignItems="center" gap={2}>
          {icon && (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
              }}
            >
              {icon}
            </Box>
          )}
          <Box>
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                }}
              >
                {title}
              </Typography>
              {badge !== undefined && (
                <Chip
                  label={badge}
                  size="small"
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              )}
            </Stack>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>

        {action && (
          <Button
            variant="contained"
            startIcon={action.icon}
            onClick={action.onClick}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            {action.label}
          </Button>
        )}
      </Stack>
      {children}
    </Box>
  );
}
