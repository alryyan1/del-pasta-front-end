
import axiosClient from "@/helpers/axios-client";
import { Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect, useState } from "react";

function Stats() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  
  useEffect(() => {
    axiosClient.get(`orderMealsStats?date=${searchQuery}`).then(({ data }) => {
      console.log(data, 'data');
      setData(data);
    });
  }, [searchQuery]);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
    <TableContainer sx={{ maxHeight: 440 }}>
    <input
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        type="date"
      />
      <Table stickyHeader>
        <TableHead>
          <TableRow>
          <TableCell className="  ">الوجبه</TableCell>
            <TableCell className="  ">الصنف</TableCell>
            <TableCell className="  ">الكميه المطلوبه</TableCell>
            {/* <TableCell align="right">الإجراءات</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
        {data.map((info, index) => (
            <TableRow key={index} className=" hover:bg-gray-100">
              <TableCell className=" text-sm ">{info.mealName}</TableCell>
              <TableCell className=" text-sm ">{info.childName}</TableCell>
              <TableCell className=" text-sm ">{info.totalQuantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  
  </Paper>
  );
}

export default Stats;