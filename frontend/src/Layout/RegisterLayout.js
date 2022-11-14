import UserForm  from "../Component/User/UserForm";

function RegisterLayout() {
  return (
    <div className="container"><UserForm createMode={true}/></div>
  )
}
export default RegisterLayout;