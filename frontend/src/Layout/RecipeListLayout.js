import { Outlet } from "react-router-dom"
import RecipeList from '../Component/Recipe/RecipeList';

function RecipeListLayout() {
  return (
      <div className="container"><RecipeList admin={true}/></div>
  )
}
export default RecipeListLayout;