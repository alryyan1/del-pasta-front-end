import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { LoadingButton } from '@mui/lab';
import axiosClient from '@/helpers/axios-client';
import { Order } from '@/Types/types';

const options:[string] = ['Cash','Transfer','Card'];

interface PayProps {
     selectedOrder: Order,
     setSelectedOrder: (order: Order) => void,
   };

export default function PayOptions({selectedOrder:activeSell,setSelectedOrder}:PayProps) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [payment, setPayment] = React.useState(activeSell.payment_type);
  const [loading , setLoading] = React.useState(false)
  // console.log(payment,'payment')
  // console.log(activeSell,'activeSell')
  const handleClick = () => {
  };

  const handleMenuItemClick = (event, payment) => {
    console.log(payment)
    setPayment(payment);
    setLoading(true)
    setOpen(false);
    axiosClient.patch(`orders/${activeSell.id}`,{payment_type:payment}).then(({data})=>{
        setSelectedOrder(data.order)
    }).finally(()=>setLoading(false))
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup  sx={{m:1}}
      
        // variant="contained"
        ref={anchorRef}
        aria-label="Button group with a nested menu"
      >
        <LoadingButton loading={loading} size='small'  onClick={handleClick}>{payment}</LoadingButton>
        <Button
         
          size="small"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option) =>{
                    console.log(option,'option',' active order',activeSell.payment_type)
                    return (  <MenuItem
                    
                        key={option}

                      //   disabled={index === 2}
                        selected={option == 'cash'}
                        onClick={(event) => handleMenuItemClick(event, option)}
                      >
                        {option}
                      </MenuItem>)
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}