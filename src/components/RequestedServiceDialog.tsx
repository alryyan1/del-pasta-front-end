import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import RequestedChildrenTable from "./RequestedChildrenTable";



const RequestedServiceDialog = ({open,handleClose,mealOrder,setSelectedOrder,meal,setShowRequestedDialog}) => {



  return (
    <div className="">
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle></DialogTitle>
        <DialogContent className="">
        <RequestedChildrenTable setShowRequestedDialog={setShowRequestedDialog}
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
