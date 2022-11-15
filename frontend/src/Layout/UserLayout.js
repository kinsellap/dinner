import { Outlet } from "react-router-dom"
import UserList from '../Component/User/UserList';

function UserLayout() {



  
  return (
      <div className="container"><UserList/></div>
  )
}
export default UserLayout;