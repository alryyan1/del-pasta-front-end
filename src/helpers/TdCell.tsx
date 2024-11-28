import { TableCell, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import axiosClient from "./axios-client";

function TdCell({
  children,
  item,
  colName,
  table ,
  show = false,
  type = null,
  multiline = false,
  update=null,
  sx = null,
  isNum = false,
  disabled = false,
}) {
  const [edited, setEdited] = useState(show);
  const [intial, setInitialVal] = useState(children);
  const [iniVal, setInitVal] = useState(children);
  const clickHandler = () => {
    if (!show) {
      setEdited(true);
    }
  };
  const changeHandler = (e) => {
    // console.log("val", e.target.value, "init val", iniVal);

    setInitVal(e.target.value);
  };
  useEffect(() => {

    // console.log("useeffect", iniVal);
    const timer = setTimeout(() => {
      updateItemName(iniVal);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [iniVal]);
  const updateItemName = (val) => {
    // console.log("update function started");
    if (intial != iniVal) {
      // console.log("diffent value");
      axiosClient
        .patch(`${table}/${item.id}`, {
           [colName]:
       val,
        })
        .then((data) => {
   
        })
     
    }
  };

  const blurHandler = () => {
    setEdited(false);
    // updateItemName(iniVal);
  };

  return (
    <TableCell
      onFocus={(event) => {
        event.target.select();
      }}
      onClick={clickHandler}
    >
      {show || edited ? (
        <TextField
        
        disabled={disabled}
          multiline={multiline}
         
         sx={sx}
          
          inputProps={{
            style: {
              textAlign: "left",
              // width: "90%",
              padding: 0,
            },
          }}
          autoFocus={!show}
          onBlur={blurHandler}
          onChange={changeHandler}
          value={iniVal}
          type={type}
          autoComplete="off"
        ></TextField>
      ) : (
        isNum ? <span style={{    
          color: "black",
          fontSize: "large",
          fontWeight: "bolder",
        }}>{Number(iniVal).toFixed(3)} </span> : <span  style={{    
          color: "black",
          fontSize: "16px",
          fontWeight: "bolder",
          textWrap:'nowrap'
        }}>{iniVal}</span>
      )}
    </TableCell>
  );
}

export default TdCell;
