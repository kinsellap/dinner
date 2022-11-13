import { Outlet } from "react-router-dom"
import RecipeForm from "../Component/Recipe/RecipeForm";

function RecipeLayout() {
  return (
      <div className="container"><RecipeForm createMode={false}/></div>
  )
}
export default RecipeLayout;