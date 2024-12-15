import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import RequestedChildrenTable from "./RequestedChildrenTable";



const RequestedServiceDialog = ({open,handleClose,mealOrder,setSelectedOrder,meal}) => {



  return (
    <div className="">
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle></DialogTitle>
        <DialogContent className="">
        <RequestedChildrenTable
                  setSelectedOrder={setSelectedOrder}
                  mealOrder={mealOrder}
                />
        </DialogContent>
        <DialogActions>
          <Button  onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RequestedServiceDialog;
