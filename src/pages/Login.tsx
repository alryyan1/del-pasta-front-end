import React, { useEffect, useState } from "react";
import { Alert, Box, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next"; // i18n hook for translations
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuthContext } from "@/contexts/AppContext";
import axiosClient from "@/helpers/axios-client";
import { Button } from "@/components/ui/button";
import loginBack from "./../assets/images/table.jpg";
import { useAuthStore } from "@/AuthStore";

function App() {
  const {setCloseLoginDialog,startSession} = useAuthStore((state)=>state)
  const { t } = useTranslation('login'); // Importing translation function
  const [error, setError] = useState({ val: false, msg: "" });
  const [loading, setLoading] = useState(false);
  const { authenticate, setUser } = useAuthContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue
  } = useForm();
 
  const submitHandler = (e) => {
    e.preventDefault()
    setLoading(true);
    axiosClient
      .post("login", {
        username,
        password
      })
      .then(({ data }) => {
        if (data.status) {
          setCloseLoginDialog()
          setUser(data.user);
          authenticate(data.token);
          startSession(data.token,data.user)

          
          localStorage.setItem("user_type", data.user.user_type);
        }
      })
      .catch((error) => {
        setError({ val: true, msg: error.response.data.message });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${loginBack})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Stack justifyContent="center" alignItems="center" direction="column">
        <Card className="rtl text-right shadow-md rounded-lg bg-white p-6 text-gray-800">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              {t("login.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form noValidate dir="rtl" onSubmit={submitHandler}>
              <Stack direction="column" gap={3}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5 text-right">
                    <Label htmlFor="username">{t("login.username")}</Label>
                    <TextField
                      id="username"
                    
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                 
                  </div>

                  <div className="flex flex-col space-y-1.5 text-right">
                    <Label htmlFor="password">{t("login.password")}</Label>
                    <TextField
                      id="password"
                      
               
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                
                  </div>
                </div>

                <Button
                  type="submit"
                  className="bg-blue-800 hover:bg-blue-900"
                  style={{
                    borderRadius: "5px",
                    padding: "10px",
                    fontWeight: "bold",
                    color: "white",
                  }}
                  disabled={loading}
                >
                  {loading ? t("login.loading") : t("login.submit")}
                </Button>
              </Stack>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center mt-2 text-white">
            {error.val && (
              <Alert severity="error" variant="outlined" sx={{ width: "100%" }}>
                {error.msg}
              </Alert>
            )}
          </CardFooter>
        </Card>
      </Stack>
      
    </Box>
  );
}

export default App;
