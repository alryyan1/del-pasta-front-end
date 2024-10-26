import { Outlet } from "react-router-dom";
import Header from "./header";

function DefaultLayout() {
  return (
    <div>
      DefaultLayout
      {<Outlet />}
    </div>
  );
}

export default DefaultLayout;
