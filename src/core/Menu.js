import React, {Fragment} from 'react';
import {Link, withRouter} from "react-router-dom"
import {signout, isAuthenticated} from "../auth/helper/index"

const currentTab = (history, path) => {
    if (history.location.pathname === path) {
        return {color: "#2ecc72"}
    } else {
        return {color: "#FFFFF"}
    }
}



const Menu = ({history, path}) => {
  return (
      <div>
        <ul className="nav nav-tabs bg-dark">
            <li className="nav-item">
                <Link style={currentTab(history, "/")} className="nav-link" to="/">Home</Link>
            </li>
            {isAuthenticated() && (
                <li className="nav-item">
                    <Link style={currentTab(history, "/cart")} className="nav-link" to="/cart">My Cart</Link>
                </li>
            )}
            {isAuthenticated() && (
                <li className="nav-item">
                    <Link style={currentTab(history, "/dashboard")} className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
            )}
            {!isAuthenticated() && (
                <Fragment>
                    <li className="nav-item">
                        <Link style={currentTab(history, "/signup")} className="nav-link" to="/signup">Sign Up</Link>
                    </li>
                    <li className="nav-item">
                        <Link style={currentTab(history, "/signin")} className="nav-link" to="/signin">Log In</Link>
                    </li>
                </Fragment>
            )}
            {isAuthenticated() && (
                <li className="nav-item">
                    <span className="nav-link text-warning" onClick={() => {
                        signout(() => {
                            history.push("/")
                        })
                    }}>Log Out</span>
                </li>
            )}
        </ul>
      </div>
  )
}

export default withRouter(Menu);