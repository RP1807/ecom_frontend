import React, { useState } from 'react';
import Base from '../core/Base';
import {Link, Redirect} from "react-router-dom"
import { authenticate, isAuthenticated, signin } from '../auth/helper';


const SignIn = () => {

    const [values, setValues] = useState({
        email: "",
        password: "",
        error: false,
        success: false,
        loading: false,
        didRedirect: false,
        isPreviousSessionExists: false
    })

    const {email, password, error, success, loading, isPreviousSessionExists} = values

    const handleChange = name => event => {
        setValues({...values, error: false, [name]: event.target.value})
    }

    const errorMessage = () => {
        return (
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <div className="alert alert-danger" style={{display: error ? "": "None"}}>
                        Login Failed
                    </div>
                </div>
            </div>
        )

    }

    const onSubmit = (event) => {
        event.preventDefault();
        setValues({...values, error: false, loading: true})
        signin({email, password})
        .then(data => {
            console.log(data)
            if (data.token) {
                // let sessionToken = data.token;
                authenticate(data, () => {
                    console.log("token added")
                    setValues({
                        ...values,
                        didRedirect: true,
                        success: true
                    })
                })
            } else {
                if (data.error === "Previous session exists") {
                    setValues({
                        ...values,
                        loading: false,
                        isPreviousSessionExists: true
                    })
                } else {
                setValues({
                    ...values,
                    loading: false,
                    error: true
                })
            }
            }
        })
        .catch(e => console.log(e))

    }

    const performRedirect = () => {
        if (isAuthenticated()) {
            return <Redirect to="/" />
        }
    }

    const loadingMessage = () => {
        return (
            loading && (
                <div className="alert alert-info">Loading...</div>
            )
        )
    }

    const sessionAlreadyExistMessage = () => {
        return (
            <div className="alert alert-warning" style={{display: isPreviousSessionExists ? "": "None"}}>Previous session already exists. Please try login again</div>
        )
    }
 
    const signInForm = () => {
        return (
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <form>
                        <div className="form-group">
                            <label className="text-light">
                            Email
                            </label>
                            <input className="form-control" value={email} type="text" onChange={handleChange("email")} />
                        </div>
                        <div className="form-group">
                            <label className="text-light">
                            Password
                            </label>
                            <input className="form-control" value={password} type="password" onChange={handleChange("password")} />
                        </div>
                        <button className="btn btn-success btn-block" onClick={onSubmit}>Log In</button>
                    </form>
                </div>
            </div>
        )
    }

  return (
      <Base title="Welcome to Sign In" description="A tshirt store">
       {loadingMessage()}
       {errorMessage()}
       {sessionAlreadyExistMessage()}
       {signInForm()}
       {performRedirect()}
      </Base>
  )
}

export default SignIn;