import { createRoot } from "react-dom/client";
import "./index.css";
import "./app.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  // <AuthProvider>
        <RouterProvider router={router} />
  //  </AuthProvider>
  // </StrictMode>
);
