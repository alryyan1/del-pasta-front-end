import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ButtonBase } from '@mui/material';
interface BasicPopoverProps {
  title: string;
  content: React.ReactNode;
  truncate :boolean
}
export default function BasicPopover({title,content
,truncate = true}:BasicPopoverProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div  style={{flexGrow:1,display:'flex',justifyContent:'space-between'}}>
      <Button  className={`  ${truncate ? 'truncated-text' :''} `} aria-describedby={id}  onClick={handleClick}>
        {title}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {content}
      </Popover>
    </div>
  );
}