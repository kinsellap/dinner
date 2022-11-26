import './App.css';
import { Route, Routes } from "react-router-dom"
import NotFound from './Layout/NotFound';
import ProfileLayout from './Layout/ProfileLayout';
import RecipeFormLayout from './Layout/RecipeFormLayout';
import RecipeListLayout from './Layout/RecipeListLayout';
import RecipeLayout from './Layout/RecipeLayout';
import LoginLayout from './Layout/LoginLayout';
import RegisterLayout from './Layout/RegisterLayout';
import PasswordResetLayout from './Layout/PasswordResetLayout';
import HeaderLayout from './Layout/HeaderLayout';

function App() {
  return (
      <div>
        <HeaderLayout />
        <Routes>
          <Route path="/" element={<LoginLayout />} />
          <Route path="/users">
            <Route index element={<ProfileLayout />} />
            <Route path="login" element={<LoginLayout />} />
            <Route path="register" element={<RegisterLayout />} />
            <Route path="reset" element={<PasswordResetLayout />} />
          </Route>
          <Route path="/recipes">
            <Route index element={<RecipeListLayout />} />
            <Route path=":id" element={<RecipeLayout />} />
            <Route path="new" element={<RecipeFormLayout />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
  );
}
export default App;
