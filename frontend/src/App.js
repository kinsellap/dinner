import './App.css';
import { Route, Routes, Link } from "react-router-dom"
import Home from './Component/Home/Home';
import NotFound from './Layout/NotFound';
import UserForm from './Component/User/UserForm';
import UserLayout from './Layout/UserLayout';
import RecipeFormLayout from './Layout/RecipeFormLayout';
import RecipeListLayout from './Layout/RecipeListLayout';
import RecipeLayout from './Layout/RecipeLayout';
import LoginLayout from './Layout/LoginLayout';
import RegisterLayout from './Layout/RegisterLayout';
import UserProvider from "./Service/UserProvider"

function App() {
  return (
    <UserProvider>
    <div>
      <nav>
        <div className="nav-wrapper">
          <Link to="/recipes" className="brand-logo left">What's for Dinner?</Link>
          <ul className="right ">
            <li><Link to="/users/login">Users</Link></li>
            <li><Link to="/recipes">Recipes</Link></li>
          </ul>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<LoginLayout />} />
        <Route path="/users">
          <Route index element={<UserLayout />} />
          <Route path="login" element={<LoginLayout/>} />
          <Route path="register" element={<RegisterLayout />} />
          <Route path="id" element={<UserLayout />} />
        </Route>
        <Route path="/recipes">
          <Route index element={<RecipeListLayout />} />
          <Route path=":id" element={<RecipeLayout/>} />
          <Route path="new" element={<RecipeFormLayout/>} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
    </UserProvider>
  );
}
export default App;
