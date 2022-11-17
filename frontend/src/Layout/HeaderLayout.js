import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import {UserContext} from "../Service/UserProvider";
import { logout } from "../Service/AuthService";
import M from 'materialize-css'


function HeaderLayout() {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  useEffect(() => {
    var elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems,{edge:'right'});
  }, [])

  const doLogout = () => {
    logout();
    setLoggedInUser();
  };

  return (
    <nav>
      <div className="nav-wrapper">
        <Link to="/" className="brand-logo center">What's for Dinner?</Link>
        <a href="#§" data-target="burger" className="sidenav-trigger"><i className="material-icons">menu</i></a>
        {/* <ul hidden={!loggedInUser} className="right hide-on-med-and-down"> */}
        <ul className="right hide-on-med-and-down">
          <li><Link to="/users">Users</Link></li>
          <li><Link to="/recipes">Recipes</Link></li>
          <li><Link to="/users/profile">Profile</Link></li>
          <li><Link to="/"><span onClick={doLogout}>Logout</span></Link></li>
        </ul>
        <ul className="sidenav !right" id="burger">
        {/* <ul hidden={!loggedInUser} className="sidenav !right" id="burger"> */}
          <li><Link to="/users">Users</Link></li>
          <li><Link to="/recipes">Recipes</Link></li>
          <li><Link to="/users/profile">Profile</Link></li>
          <li><Link to="/"><span onClick={doLogout}>Logout</span></Link></li>
        </ul>
      </div>
    </nav>
  )
}
export default HeaderLayout;