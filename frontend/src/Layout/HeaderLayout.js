import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../Service/UserProvider";
import { removeAuthenticatedUser } from "../Service/SessionService";
import M from 'materialize-css';

function HeaderLayout() {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);

  useEffect(() => {
    var elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems, { edge: 'right' });
  }, [])

  const doLogout = () => {
    removeAuthenticatedUser();
    setLoggedInUser();
    setTimeout(() => navigate('/'), 100);
  };

  return (
    <nav>
      <div className="nav-wrapper">
        <Link to="/recipes" className="brand-logo center">What's for Dinner?</Link>
        <a href="#§" data-target="burger" className="sidenav-trigger"><i className="material-icons">menu</i></a>
        <ul className="right hide-on-med-and-down">
          <li hidden={!loggedInUser}><Link to="/users">Profile</Link></li>
          <li><Link to="/recipes">Recipes</Link></li>
          <li hidden={!loggedInUser}><Link onClick={doLogout}>Logout</Link></li>
          <li hidden={loggedInUser}><Link to="/users/register">Register</Link></li>
        </ul>
        <ul className="sidenav !right" id="burger">
          <li hidden={!loggedInUser}><Link to="/users">Profile</Link></li>
          <li><Link to="/recipes">Recipes</Link></li>
          <li hidden={!loggedInUser}><Link to="/"><span onClick={doLogout}>Logout</span></Link></li>
          <li hidden={loggedInUser}><Link to="/users/register">Register</Link></li>
        </ul>
      </div>
    </nav>
  )
}
export default HeaderLayout;