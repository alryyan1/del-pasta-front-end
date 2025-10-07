import { createRoot } from "react-dom/client";
import 'antd/dist/reset.css';
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  // <AuthProvider>
        <div style={{ height: '100vh' }}>
          <RouterProvider router={router} />
        </div>
  //  </AuthProvider>
  // </StrictMode>
);
