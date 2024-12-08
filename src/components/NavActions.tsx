import { webUrl } from "@/helpers/constants";
import { IconButton } from "@mui/material";
import { Stack } from "@mui/system";
import { Users } from "lucide-react";
import React from "react";
import LogoutIcon from '@mui/icons-material/Logout';
import axiosClient from "@/helpers/axios-client";
import { useAuthContext } from "@/contexts/stateContext";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwither";

function NavActions() {
    const [loading, setLoading] = React.useState(false);
    const { authenticate, setUser } = useAuthContext();
    const navigate = useNavigate();
    const logoutHandler = () => {
        setLoading(true);
        console.log("navigate to to login");
        axiosClient
          .post("logout")
          .then(() => {
            authenticate(null);
            setUser(null);
            localStorage.clear();
            setTimeout(() => {
                navigate("/login");
            }, 300);
          })
          .finally(() => setLoading(false));
      };
  return (
    <Stack direction={"row"} gap={1}>
      {/* <IconButton  title="المستخدمين" href={`${webUrl}users`}>
        <Users />
      </IconButton> */}
      <IconButton onClick={logoutHandler} title="تسجيل خروج">
        <LogoutIcon />
      </IconButton>
      <LanguageSwitcher/>
    </Stack>
  );
}

export default NavActions;
