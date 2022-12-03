import React, { useState, useContext } from "react";
import { UserContext } from "../../Service/UserProvider";
import { createUser, loginUser } from "../../Service/ApiService";
import { getErrorDetails } from "../../Utils/ErrorUtils";
import M from "materialize-css";
import { useNavigate, Link } from "react-router-dom";
import { setAuthenticatedUser, setAuthToken } from "../../Service/SessionService";

function UserForm(props) {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const navigate = useNavigate();
    const isRegister = props.createMode;
    const formAction = isRegister ? "Register" : "Login";
    const [values, setValues] = useState({
        first_name: '',
        last_name: '',
        email_address: '',
        password: ''
    });

    const handleFirstNameChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            first_name: event.target.value,
        }));
    };

    const handleLastNameChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            last_name: event.target.value,
        }));
    };

    const handleEmailChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            email_address: event.target.value,
        }));
    };

    const handlePasswordChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            password: event.target.value,
        }));
    };

    const doRegister = async (event) => {
        event.preventDefault();
        await createUser(values)
            .then((res) => {
                setLoggedInUser(res.data.user);
                setAuthenticatedUser(res.data.user);
                setAuthToken(res.data.token)
                M.toast({ html: `User ${res.data.user.first_name} ${res.data.user.last_name} created` })
                setTimeout(() => navigate('/recipes'), 1000);
            })
            .catch((err) => {
                M.toast({ html: `There was an error creating this user ${getErrorDetails(err)} `, classes: 'red' })
                console.log(err)
            })
    };

    const doLogin = async (event) => {
        event.preventDefault();
        const { email_address, password } = values;
        await loginUser({ email_address, password }).then((res) => {
            setLoggedInUser(res.data.user);
            setAuthenticatedUser(res.data.user);
            setAuthToken(res.data.token)
            M.toast({ html: `Welcome ${res.data.user.first_name} ${res.data.user.last_name}!` })
            setTimeout(() => navigate('/recipes'), 1000);
        }).catch((err) => {
            M.toast({ html: `There was an error getting this user ${getErrorDetails(err)} `, classes: 'red' })
            console.log(err)
        })
    };

    return (
        <div className="col s12">
            <h4 className="teal-text text-lighten-2">{formAction}</h4>
            <form onSubmit={isRegister ? doRegister : doLogin}>
                <div hidden={!isRegister} className="row">
                    <div className="input-field col s12">
                        <input className="validate" id="first-name" value={values.first_name} type="text" required={isRegister} maxLength="20" onChange={handleFirstNameChange} />
                        <label htmlFor="first-name">First Name</label>
                    </div>
                </div>
                <div hidden={!isRegister} className="row">
                    <div className="input-field col s12">
                        <input className="validate" id="last-name" value={values.last_name} type="text" required={isRegister} maxLength="20" onChange={handleLastNameChange} />
                        <label htmlFor="last-name">Last Name</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                        <input className="validate" id="email-address" value={values.email_address} type="email" required onChange={handleEmailChange} />
                        <label htmlFor="email-address" data-error="wrong" data-success="right">Email</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                        <input id="password" value={values.password} type="password" minLength="5" maxLength="20" required autoComplete="on" onChange={handlePasswordChange} />
                        <label htmlFor="password">Password</label>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <button className="btn waves-light" type="submit">{formAction}
                            <i className="material-icons right">account_circle</i></button>
                    </div>
                </div>
                <div hidden={!isRegister} className="row">
                    <div className="col s12">
                        <span>Already have an account?</span> <Link to="/users/login"><span>Login
                            <i className="material-icons tiny">chevron_right</i></span></Link>
                    </div>
                </div>
                <div hidden={isRegister} className="row">
                    <div className="col s12">
                        <span>Don't have an account?</span> <Link to="/users/register"><span>Register
                            <i className="material-icons tiny">chevron_right</i></span></Link>
                    </div>
                </div>
            </form>
        </div>
    )

}

export default UserForm;