
import DepositDialog from "@/components/DepositDialog";
import axiosClient from "@/helpers/axios-client";
import { Button, Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import axios from "axios";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

function Stats() {
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState("");
  let [data, setData] = useState([]);
  const [childName, setChildName] = useState('')
  const [mealName, setMealName] = useState('')
  const [childId,setChildId] = useState(null)
  const [update,setUpdate]= useState(0)
  const [showAddDepositDialog,setShowAddDepositDialog] = useState(false)
  const handleClose = ()=>{
    setShowAddDepositDialog(false)
    setUpdate((u)=>u+1)
  }
  
  useEffect(() => {
    axiosClient.get(`orderMealsStats?date=${searchQuery}`).then(({ data }) => {
      console.log(data, 'data');
      setData(data);
    });
  }, [searchQuery,update]);

  data = data.filter((d)=>{
    return d.childName.toLowerCase().includes(search.toLowerCase()) || d.mealName.toLowerCase().includes(search.toLowerCase())
  })
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
    <TableContainer >
    <Stack sx={{mt:1,mb:1}} direction="row" spacing={2}>
    <input
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        type="date"
      />
      <TextField label='بحث' onChange={(e)=>{
        setSearch(e.target.value)
      }} size="small" />
    </Stack>

      <Table size="small" className="order-table" stickyHeader>
        <TableHead>
          <TableRow>
          <TableCell className="  ">الاسم</TableCell>
            <TableCell className="  ">الصنف</TableCell>
            <TableCell className="  ">الكميه المطلوبه</TableCell>
            <TableCell className="  "> الكميه المتوفره</TableCell>
            <TableCell className="  "> الكميه المسحوبه</TableCell>
            <TableCell className="  "> صافي </TableCell>
            <TableCell className="  "> الباقي </TableCell>
            <TableCell className="  "> اضافه كميه </TableCell>
            {/* <TableCell align="right">الإجراءات</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
        {data.map((info, index) => {
            let remaining = info.totalDeposit - info.totalQuantity;
           return (<TableRow  key={index} className={` hover:bg-slate-200 ${remaining < 0 ? 'bg-red-300':'bg-green-300'}`}>
              <TableCell className=" text-sm ">{info.mealName}</TableCell>
              <TableCell className=" text-sm ">{info.childName}</TableCell>
              <TableCell className=" text-sm ">{info.totalQuantity}</TableCell>
              <TableCell className=" text-sm ">{info.totalDeposit}</TableCell>
              <TableCell className=" text-sm ">{info.totalDeduct}</TableCell>
              <TableCell className=" text-sm ">{info.totalDeposit - info.totalDeduct}</TableCell>
              <TableCell className=" text-sm ">{remaining }</TableCell>
              <TableCell className=" text-sm "><Button variant="contained" size="small" className="hover:bg-slate-600 hover:text-white" onClick={()=>{
               setShowAddDepositDialog(true)
                setChildId(info.childId)
                setChildName(info.childName)
                setMealName(info.mealName)
               
              }}><Plus/></Button></TableCell>
            </TableRow>)}
          )}
        </TableBody>
      </Table>
    </TableContainer>
    <DepositDialog update selectedChild={childId} childName={childName} mealName={mealName} open={showAddDepositDialog} handleClose={handleClose}/>
  
  </Paper>
  );
}

export default Stats;