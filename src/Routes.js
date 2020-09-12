import React from "react"
import {BrowserRouter, Switch, Route} from "react-router-dom"
import Home from "./core/Home"
import PrivateRoutes from "./auth/helper/PrivateRoutes"
import SignUp from "./user/SignUp"
import dashboard from "./user/UserDashboard"
import signIn from "./user/SignIn"
import Cart from "./core/Cart"


const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/signup" exact component={SignUp} />
                <Route path="/signin" exact component={signIn} />
                <PrivateRoutes path="/dashboard" exact component={dashboard} />
                <PrivateRoutes path="/cart" exact component={Cart} />
            </Switch>
        </BrowserRouter>
    )
}


export default Routes;