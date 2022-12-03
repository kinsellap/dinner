import UserForm  from "../Component/User/UserForm";

function LoginLayout() {
  return (
    <div className="container"><UserForm createMode={false}/></div>
  );
}
export default LoginLayout;