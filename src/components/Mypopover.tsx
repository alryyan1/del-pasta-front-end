import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ButtonBase, Tooltip } from '@mui/material';
import { Order } from '@/Types/types';
interface BasicPopoverProps {
  title: string;
  content: React.ReactNode;
  truncate :boolean
  selectedOrder:Order;
}
export default function BasicPopover({title,content,selectedOrder
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
      <Tooltip title={title}><Button disabled={selectedOrder?.order_confirmed} className={`  ${truncate ? 'truncated-text' :''} `} aria-describedby={id}  onClick={handleClick}>
        {title}
      </Button></Tooltip>
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