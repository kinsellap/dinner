import './App.css';
import { useState } from 'react';
import { Route, Routes } from "react-router-dom"
import ProfileLayout from './Layout/ProfileLayout';
import NotFound from './Layout/NotFound';
import UserLayout from './Layout/UserLayout';
import RecipeFormLayout from './Layout/RecipeFormLayout';
import RecipeListLayout from './Layout/RecipeListLayout';
import RecipeLayout from './Layout/RecipeLayout';
import LoginLayout from './Layout/LoginLayout';
import RegisterLayout from './Layout/RegisterLayout';
import HeaderLayout from './Layout/HeaderLayout';
import { useContext, useEffect } from "react";
import { UserContext } from "./Service/UserProvider";
import { getAuthenticatedUser } from './Service/AuthService';

function App() {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  useEffect(() => {
    if (!loggedInUser) {
      setLoggedInUser(getAuthenticatedUser());
    }
  })
  return (
      <div>
        <HeaderLayout />
        <Routes>
          <Route path="/" element={<LoginLayout />} />
          <Route path="/users">
            <Route index element={<UserLayout />} />
            <Route path="profile" element={<ProfileLayout />} />
            <Route path="login" element={<LoginLayout />} />
            <Route path="register" element={<RegisterLayout />} />
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
