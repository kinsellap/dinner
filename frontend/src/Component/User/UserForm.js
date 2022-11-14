import React, { useState } from "react";
import { createUser, login } from "../../Service/ApiService";
import M from "materialize-css";

function UserForm(props) {
    const isRegister = props.createMode;
    const formAction = isRegister ? "Register" : "Login";
    const [values, setValues] = useState({
        first_name: '',
        last_name: '',
        email_address: '',
        password: '',
        admin: false
    });

    const [loggedInUser, setLoggedInUser] = useState(undefined);

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
                setLoggedInUser(res.data);
                M.toast({ html: `User ${values.first_name} ${values.last_name} created` })
            })
            .catch((err) => {
                M.toast({ html: `There was an error creating this user ${getErrorDetails(err)} `, classes: 'red' })
                console.log(err)
            })
    };

    const doLogin = async (event) => {
        event.preventDefault();
        const { email_address, password } = values;
        await login({ email_address, password }).then((res) => {
            setLoggedInUser(res.data);
            M.toast({ html: `Welcome ${values.first_name} ${values.last_name}!` })
        }).catch((err) => {
            M.toast({ html: `There was an error getting this user  ${getErrorDetails(err)} `, classes: 'red' })
            console.log(err)
        })
    };

    const getErrorDetails = (err) => {
        if (err.response?.data?.error) {
            return " - " + err.response.data.error;
        }
    }

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
                        <input id="password" value={values.password} type="password" minLength="5" required onChange={handlePasswordChange} />
                        <label htmlFor="password">Password</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                        <button className="btn waves-light" type="submit">{formAction}
                            <i className="material-icons right">account_circle</i></button>
                    </div>
                </div>
            </form>
        </div>
    )

}

export default UserForm;