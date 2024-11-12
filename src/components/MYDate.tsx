import axiosClient from "@/helpers/axios-client";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";

//create interface 
interface MyDateProps {
    val: any;
    item: any;
    disabled: boolean;
    label?: string;
    path?: string;
    colName?: string;
  };

function MyDateField2({ val, item ,disabled, label='تاريخ الانتهاء',path,colName}: MyDateProps) {
  // console.log(item,'item in date field')
  // console.log(item , val,'date filed ')
  // console.log(dayjs(val), "date filed ", val, "val");
  const [date, setDate] = useState(val);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateField
      
      disabled={disabled}
      label={label}
      format='YYYY-MM-DD'
      
        size="small"
        defaultValue={dayjs(date)}
        value={dayjs(date)}
        onChange={(val) => {
          const dayJsObj = dayjs(val);

          setDate(val);
       
          axiosClient
            .patch(`${path}/${item.id}`, {
              [colName]: `${dayJsObj.year()}/${
                dayJsObj.month() + 1
              }/${dayJsObj.date()}`,
            })
            
        }}
      />
    </LocalizationProvider>
  );
}

export default MyDateField2;
