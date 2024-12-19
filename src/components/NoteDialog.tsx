import React, { Dispatch, SetStateAction } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { Order } from "@/Types/types";
import { Stack } from "@mui/system";
import axiosClient from "@/helpers/axios-client";

interface NoteDialogProbs {
  open: boolean;
  handleClose: () => void;
  selectedOrder: Order;
  setSelectedOrder: Dispatch<SetStateAction<Order>>;
}

const NoteDialog = ({ handleClose, open, selectedOrder,setSelectedOrder}: NoteDialogProbs) => {
    const [note, setNote] = React.useState();
    const handleSave = ()=>{
        axiosClient.patch(`orders/${selectedOrder.id}`,{
            draft:note
        }).then(({data})=>{

            setSelectedOrder(data.order);
        });
        handleClose();
    }
  return (
    <div className="">
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle></DialogTitle>
        <DialogContent className="">
            <Stack direction={'column'} gap={1}>

            <Typography variant="h6" className="mb-1" textAlign={'center'}>مسوده</Typography>
            <TextField defaultValue={selectedOrder.draft} onChange={(e)=>setNote(e.target.value)} sx={{width:'500px'}} fullWidth multiline rows={8} ></TextField>
            <Button onClick={handleSave} variant="contained">حفظ</Button>
            </Stack>
         
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NoteDialog;
