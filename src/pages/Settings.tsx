import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    FormGroup,
    Grid,
    Paper,
    TextField,
    Typography,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
import axiosClient from "@/helpers/axios-client";
  function encodeImageFileAsURL(file,colName) {
    var reader = new FileReader();
    reader.onloadend = function () {
      console.log("RESULT", reader.result);
      saveToDb(colName, reader.result);
    };
    reader.readAsDataURL(file);
  }
  const saveToDb = (colName, data) => {
    axiosClient.post("settings", { colName, data }).then(({ data }) => {
      console.log(data);
    });
  };
  function Settings() {
    const [file, setFile] = useState(null);
    const [src, setSrc] = useState(null);
    const [settings, setSettings] = useState(null);
    useEffect(()=>{
      axiosClient.get("settings").then(({ data }) => {
        console.log(data,'data see')
        setSettings(data);
      });
    },[])
    
    console.log(settings,'settings are set')
    const handleFileChange = (e,colName) => {
      encodeImageFileAsURL(e.target.files[0],colName);
      const url = URL.createObjectURL(e.target.files[0]);
      console.log(url, "path");
      setSrc(url);
      console.log("upload", e.target.files[0]);
      if (e.target.files) {
        setFile(e.target.files[0]);
      }
    };
    const [welcomeMsg,setWelcomeMsg] = useState('')
    const image1 = new Image(100,100)
    image1.src = settings?.header_base64;
  
    const image2 = new Image(100,100)
    image2.src = settings?.footer_base64;
    console.log(image1)
    return (
      <Grid gap={4} container>
        <Grid item xs={4}>
          <Typography textAlign={'center'} variant="h3"> Header </Typography>
          <input onChange={(e)=>{
            handleFileChange(e,'header_base64')
          }} type="file"></input>
          {file && (
            <section>
              File details:
              <ul>
                <li>Name: {file.name}</li>
              </ul>
            </section>
          )}
             <img width={100} src={image1.src} alt="" />
  
          <Divider />
          <Typography textAlign={'center'} variant="h3">Footer</Typography>
  
          <input onChange={(e)=>{
            handleFileChange(e,'footer_base64')
          }} type="file"></input>
          {file && (
            <section>
              File details:
              <ul>
                <li>Name: {file.name}</li>
              </ul>
            </section>
          )}
             <img width={100} src={image2.src} alt="" />
  
        </Grid>
        <Grid xs={3}>
          <Box key={settings?.id} sx={{p:1}}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                  defaultChecked={settings?.is_header}
                    onChange={(e) => {
                      axiosClient.post("settings", {
                        colName: "is_header",
                        data: e.target.checked,
                      });
                    }}
                  />
                }
                label={"الترويسه"}
              />
            </FormGroup>
      
      
    
    
            <Divider />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                  defaultChecked={settings?.is_footer}
                    onChange={(e) => {
                      axiosClient.post("settings", {
                        colName: "is_footer",
                        data: e.target.checked,
                      });
                    }}
                  />
                }
                label={"فوتر"}
              />
            </FormGroup>
            <Divider />
      
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                  defaultChecked={settings?.is_logo}
  
                    onChange={(e) => {
                      axiosClient.post("settings", {
                        colName: "is_logo",
                        data: e.target.checked,
                      });
                    }}
                  />
                }
                label={"لوقو"}
              />
            </FormGroup>
            <Divider/>
            <TextField defaultValue={settings?.kitchen_name} sx={{mb:1}} label='اسم الموسسه' fullWidth onChange={(e)=>{
               axiosClient.post("settings", {
                colName: "kitchen_name",
                data: e.target.value,
              });
            }}/>
              <Divider/>
              <TextField defaultValue={settings?.currency} sx={{mb:1}} label='العمله ' fullWidth onChange={(e)=>{
               axiosClient.post("settings", {
                colName: "currency",
                data: e.target.value,
              });
            }}/>
              <Divider/>
           
             <TextField defaultValue={settings?.phone} sx={{mb:1}} label='الهاتف ' fullWidth onChange={(e)=>{
               axiosClient.post("settings", {
                colName: "phone",
                data: e.target.value,
              });
            }}/>
         
              <Divider/>
             <TextField defaultValue={settings?.vatin} label='vat in' fullWidth onChange={(e)=>{
               axiosClient.post("settings", {
                colName: "vatin",
                data: e.target.value,
              });
            }}/>
              <Divider/>
             <TextField defaultValue={settings?.cr} label='cr' fullWidth onChange={(e)=>{
               axiosClient.post("settings", {
                colName: "cr",
                data: e.target.value,
              });
            }}/>
              <Divider/>
             <TextField defaultValue={settings?.email} label='email' fullWidth onChange={(e)=>{
               axiosClient.post("settings", {
                colName: "email",
                data: e.target.value,
              });
            }}/>
             <Divider/>
             <TextField defaultValue={settings?.address} label='address' fullWidth onChange={(e)=>{
               axiosClient.post("settings", {
                colName: "address",
                data: e.target.value,
              });
            }}/>
          </Box>
        </Grid>
        <Grid xs={3}>
            <Box sx={{p:1}}>
              <Divider>الرساله  الترحيبيه</Divider>
             <TextField  defaultValue={settings?.header_content} sx={{mb:1}}  rows={10}  multiline fullWidth onChange={(e)=>{
             setWelcomeMsg(e.target.value)
            }}/>
            <Button fullWidth variant="contained" sx={{mb:1}} onClick={()=>{
              axiosClient.post("settings", {
                colName: "header_content",
                data: welcomeMsg,
              });
              axiosClient.post("settings", {
                colName: "is_footer",
                data: false,
              });
            
            }}>حفظ</Button>

            <Divider/>
            <TextField defaultValue={settings?.footer_content} rows={3}  label='محتوي الفوتر' multiline fullWidth onChange={(e)=>{
               axiosClient.post("settings", {
                colName: "footer_content",
                data: e.target.value,
              });
            }}/>
            <Divider/>
            </Box>
        </Grid>
      </Grid>
    );
  }
  
  export default Settings;
  