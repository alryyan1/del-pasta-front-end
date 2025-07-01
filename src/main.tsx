import { createRoot } from "react-dom/client";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { AppContextProvider } from "./contexts/AppContext";

createRoot(document.getElementById("root")!).render(
  <I18nextProvider i18n={i18n}>
    <AppContextProvider>
      <RouterProvider router={router} />
    </AppContextProvider>
  </I18nextProvider>
);
