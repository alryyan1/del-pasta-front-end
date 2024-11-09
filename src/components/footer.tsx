import { Typography } from "@mui/material";

 function SidebarFooter({ mini }) {
  return (
    <Typography
      variant="caption"
      sx={{ m: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}
    >
      {mini ? '© MUI' : `© ${new Date().getFullYear()} Made By IntajStars `}
    </Typography>
  );
}

export default SidebarFooter;