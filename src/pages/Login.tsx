import React, { useState } from "react";
import { Alert, Box, Stack, Typography } from "@mui/material";
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
import { useAuthContext } from "@/contexts/stateContext";
import axiosClient from "@/helpers/axios-client";
import { Button } from "@/components/ui/button";
import loginBack from "./../assets/images/laundry-1.jpg";

function App() {
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
  } = useForm();

  const submitHandler = (data) => {
    setLoading(true);
    axiosClient
      .post("login", data)
      .then(({ data }) => {
        if (data.status) {
          setUser(data.user);
          authenticate(data.token);
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
            <form noValidate dir="rtl" onSubmit={handleSubmit(submitHandler)}>
              <Stack direction="column" gap={3}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5 text-right">
                    <Label htmlFor="username">{t("login.username")}</Label>
                    <Input
                      id="username"
                      className="text-right"
                      style={{
                        borderRadius: "5px",
                        direction: "rtl",
                        padding: "10px",
                      }}
                      {...register("username")}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                 
                  </div>

                  <div className="flex flex-col space-y-1.5 text-right">
                    <Label htmlFor="password">{t("login.password")}</Label>
                    <Input
                      id="password"
                      className="text-right"
                      style={{
                        borderRadius: "5px",
                        direction: "rtl",
                        padding: "10px",
                      }}
                      {...register("password")}
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
