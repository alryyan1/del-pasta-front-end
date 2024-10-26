import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";
import { AuthProvider } from "./contexts/stateContext.tsx";
import { CacheProvider } from "@emotion/react";
import { cacheRtl, theme } from "./helpers/constants.ts";
import { ThemeProvider } from "@mui/material";
import { Toaster } from "./components/ui/toaster.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <AuthProvider>
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </CacheProvider>
  </AuthProvider>
  // </StrictMode>
);
