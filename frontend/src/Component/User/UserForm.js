import React, { useState } from "react";
import { createUser } from "../../Service/ApiService";
import M from "materialize-css";

function UserForm(props) {
    const [values, setValues] = useState({
        first_name: '',
        last_name: '',
        email_address: '',
        password: '',
        admin: false
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

    const doSubmit = async (event) => {
        event.preventDefault();
        await createUser(values)
        .then((res) => {
            M.toast({ html: `User ${values.first_name} ${values.last_name} created`})
            setTimeout(() => window.location.reload(), 1000);
        })
        .catch((err) => {
            M.toast({ html: 'There was an error creating this user', classes: 'red'  })
            console.log(err)
        })      
    };

    return (
        <div className="col s12">
            <h4>Add a new user</h4>
            <form onSubmit={doSubmit}>
                <div className="row">
                    <div className="input-field col s6">
                        <input className="validate" id="first-name" value={values.first_name} type="text" required maxLength="20" onChange={handleFirstNameChange} />
                        <label htmlFor="first-name">First Name</label>

                    </div>
                    <div className="input-field col s6">
                        <input className="validate" id="last-name" value={values.last_name} type="text" required maxLength="20" onChange={handleLastNameChange} />
                        <label htmlFor="last-name">Last Name</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s6">
                        <input className="validate" id="email-address" value={values.email_address} type="email" required onChange={handleEmailChange} />
                        <label htmlFor="email-address" data-error="wrong" data-success="right">Email</label>
                    </div>
                    <div className="input-field col s6">
                        <input id="password" value={values.password} type="text" required onChange={handlePasswordChange} />
                        <label htmlFor="password">Password</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                        <button className="btn waves-effect waves-light" type="submit" name="action">Add User</button>
                    </div>
                </div>
            </form>
        </div>
    )

}

export default UserForm;