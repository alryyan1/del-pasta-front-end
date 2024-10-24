import { Navigate, Outlet } from "react-router-dom";
import {useAuthContext} from '../contexts/stateContext'
function DefaultLayout() {
  const {user,token} =  useAuthContext();
  debugger;
  console.log(token,'token')
  if (!token) {
    return <Navigate to={'/login'}/>
  }
  return (
    <div>
      DefaultLayout
      {<Outlet />}
    </div>
  );
}

export default DefaultLayout;
