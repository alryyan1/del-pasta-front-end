import React, { useEffect, useState } from "react";
import axiosClient from "@/helpers/axios-client";
import { useTranslation } from "react-i18next";
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
import { Stack } from "@mui/system";

function encodeImageFileAsURL(file, colName) {
  var reader = new FileReader();
  reader.onloadend = function () {
    saveToDb(colName, reader.result);
  };
  reader.readAsDataURL(file);
}

const saveToDb = (colName, data) => {
  axiosClient.post("settings", { colName, data }).then(({ data }) => {
    // console.log(data);
  });
};

function Settings() {
  const { t } = useTranslation('settings');
  const [file, setFile] = useState(null);
  const [src, setSrc] = useState(null);
  const [settings, setSettings] = useState(null);
  const [welcomeMsg, setWelcomeMsg] = useState("");

  useEffect(() => {
    axiosClient.get("settings").then(({ data }) => {
      setSettings(data);
    });
  }, []);

  const handleFileChange = (e, colName) => {
    encodeImageFileAsURL(e.target.files[0], colName);
    const url = URL.createObjectURL(e.target.files[0]);
    setSrc(url);
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const image1 = new Image(100, 100);
  image1.src = settings?.header_base64;

  const image2 = new Image(100, 100);
  image2.src = settings?.footer_base64;

  return (
    <Grid gap={4} container>
      {/* Welcome Text */}
    

      <Grid item xs={12} lg={4}>
        <Typography textAlign={'center'} variant="h3">
          {t('header')}
        </Typography>
        <input
          onChange={(e) => handleFileChange(e, 'header_base64')}
          type="file"
        />
        {file && (
          <section>
            <ul>
              <li>{t('fileDetailsName')}: {file.name}</li>
            </ul>
          </section>
        )}
        <img width={100} src={image1.src} alt="" />

     
        <Typography textAlign={'center'} variant="h3">
          {t('footer')}
        </Typography>

        <input
          onChange={(e) => handleFileChange(e, 'footer_base64')}
          type="file"
        />
        {file && (
          <section>
            <ul>
              <li>{t('fileDetailsName')}: {file.name}</li>
            </ul>
          </section>
        )}
        <img width={100} src={image2.src} alt="" />
      </Grid>

      <Grid item xs={12} lg={3}>
        <Stack direction={'column'} gap={1} key={settings?.id} sx={{ p: 1 }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={settings?.is_header === 1}
                  onChange={(e) => {
                    axiosClient.post("settings", {
                      colName: "is_header",
                      data: e.target.checked,
                    });
                  }}
                />
              }
              label={t('headerLabel')}
            />
          </FormGroup>

       
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={settings?.is_footer === 1}
                  onChange={(e) => {
                    axiosClient.post("settings", {
                      colName: "is_footer",
                      data: e.target.checked,
                    });
                  }}
                />
              }
              label={t('footerLabel')}
            />
          </FormGroup>
       

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={settings?.is_logo === 1}
                  onChange={(e) => {
                    axiosClient.post("settings", {
                      colName: "is_logo",
                      data: e.target.checked,
                    });
                  }}
                />
              }
              label={t('logoLabel')}
            />
          </FormGroup>
       

          <TextField
            defaultValue={settings?.kitchen_name}
            sx={{ mb: 1 }}
            label={t('institutionName')}
            fullWidth
            variant='standard'
            onChange={(e) => {
              axiosClient.post("settings", {
                colName: "kitchen_name",
                data: e.target.value,
              });
            }}
          />
       

          <TextField
            defaultValue={settings?.currency}
            sx={{ mb: 1 }}
            label={t('currencyLabel')}
            fullWidth
            variant='standard'
            onChange={(e) => {
              axiosClient.post("settings", {
                colName: "currency",
                data: e.target.value,
              });
            }}
          />
       

          <TextField
            defaultValue={settings?.inventory_notification_number}
            sx={{ mb: 1 }}
            label={t('employeePhone')}
            fullWidth
            variant='standard'
            onChange={(e) => {
              axiosClient.post("settings", {
                colName: "inventory_notification_number",
                data: e.target.value,
              });
            }}
          />
       

          <TextField
            defaultValue={settings?.vatin}
            label={t('vatin')}
            fullWidth
            variant='standard'
            onChange={(e) => {
              axiosClient.post("settings", {
                colName: "vatin",
                data: e.target.value,
              });
            }}
          />
       

          <TextField
            defaultValue={settings?.cr}
            label={t('cr')}
            fullWidth
            variant='standard'
            onChange={(e) => {
              axiosClient.post("settings", {
                colName: "cr",
                data: e.target.value,
              });
            }}
          />
       

          <TextField
            defaultValue={settings?.email}
            label={t('emailLabel')}
            fullWidth
            variant='standard'
            onChange={(e) => {
              axiosClient.post("settings", {
                colName: "email",
                data: e.target.value,
              });
            }}
          />
       

          <TextField
            defaultValue={settings?.address}
            label={t('addressLabel')}
            fullWidth
            variant='standard'
            onChange={(e) => {
              axiosClient.post("settings", {
                colName: "address",
                data: e.target.value,
              });
            }}
          />
        </Stack>
      </Grid>

      <Grid item xs={12} lg={3}>
        <Box sx={{ p: 1 }}>
          <Divider>{t('welcomeMessage')}</Divider>
          <TextField
            defaultValue={settings?.header_content}
            sx={{ mb: 1 }}
            rows={10}
            multiline
            fullWidth
            onChange={(e) => {
              setWelcomeMsg(e.target.value);
            }}
          />
          <Button
            fullWidth
            variant='standard'
            variant="contained"
            sx={{ mb: 1 }}
            onClick={() => {
              axiosClient.post("settings", {
                colName: "header_content",
                data: welcomeMsg,
              });
              axiosClient.post("settings", {
                colName: "is_footer",
                data: false,
              });
            }}
          >
            {t('save')}
          </Button>

       
          <div style={{direction:'ltr'}}>
              <TextField
            defaultValue={settings?.footer_content}
            rows={3}
            label={t('footerContent')}
            multiline
            fullWidth
            onChange={(e) => {
              axiosClient.post("settings", {
                colName: "footer_content",
                data: e.target.value,
              });
            }}
          />
          </div>
        
       
        </Box>
      </Grid>
    </Grid>
  );
}

export default Settings;
