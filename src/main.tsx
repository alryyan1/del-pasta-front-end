import { createRoot } from "react-dom/client";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  // <AuthProvider>
        <RouterProvider router={router} />
  //  </AuthProvider>
  // </StrictMode>
);
