import { Link } from "react-router-dom";
import {useContext} from "react";
import UserContext from "../Service/UserContext";

function HeaderLayout() {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);

  const doLogout = () => {
		localStorage.removeItem('user');
    console.log(loggedInUser);
		setLoggedInUser();
    console.log(loggedInUser);
		// history.push('/');
	};

  return (
    <nav>
    <div className="nav-wrapper">
      <Link to="/" className="brand-logo left">What's for Dinner?</Link>
      <ul hidden={!loggedInUser} className="right ">
        <li><Link to="/users">Users</Link></li>
        <li><Link to="/recipes">Recipes</Link></li>
        <li><Link to="/"><span onClick={doLogout}>Logout</span></Link></li>
      </ul>
    </div>
  </nav>
  )
}
export default HeaderLayout;