import React, {useState, useEffect} from "react"
import { Redirect } from "react-router-dom"
import {cartEmpty} from "./helper/cartHelper"
import {getmeToken, processPayment} from "./helper/paymentHelper"
import {createOrder} from "./helper/orderHelper"
import {isAuthenticated, signout} from "../auth/helper/index"

import DropIn from "braintree-web-drop-in-react"


const PaymentB = (
    products, 
    reload=undefined,
    setReload=f => f
) => {
    const [info, setInfo] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: {}
    })

    const userId = isAuthenticated && isAuthenticated().user.id
    const token = isAuthenticated && isAuthenticated().token

    const getToken = (userId, token) => {
        getmeToken(userId, token)
        .then(data => {
            if (data.error) {
                setInfo({
                    ...info,
                    error: data.error
                })
                signout(() => {
                    return <Redirect to="/" />
                })
            } else {
                setInfo({
                    ...info,
                    clientToken: data.client_token
                })
            }
        })
    }

    useEffect(() => {
        getToken(userId, token)
    }, []);

    const getAmount = () => {
        let amount = 0
        console.log(products)
        products.products.map((p) => {
            amount = amount + parseInt(p.price)
        })
        return amount
    }

    const onPurchase = () => {
        setInfo({loading: true})
        let nonce;
        let getNonce = info.instance.requestPaymentMethod()
        .then(data => {
            console.log("MyDATA", data)
            nonce = data.nonce;
            const paymentData = {
                paymentMethodNonce: nonce,
                amount: getAmount()
            };
            processPayment(userId, token, paymentData)
            .then(response => {
                console.log("P-1", response)
                if (response.error) {
                    if (response.code == 1) {
                        console.log("Payment Failed")
                        signout(() => {
                            return <Redirect to="/" />
                        })
                    }
                } else {
                    setInfo({...info, 
                        success: response.success,
                        loading: false
                    })
                    console.log("Payment Success")
                    let product_names = ""
                    products.products.forEach((item) => {
                        product_names += item.name + ","
                    })
                    const orderData = {
                        products: product_names,
                        transaction_id: response.transaction.id,
                        amount: response.transaction.amount
                    }
                    createOrder(userId, token, orderData)
                    .then(response => {
                        if (response.error) {
                            if (response.code == 1) {
                                console.log("Order failed")
                            }
                            signout(() => {
                                return <Redirect to="/" />
                            })
                        } else {
                            if (response.success == true) {
                                console.log("Order Placed")
                            }
                        }
                    })
                    .catch(e => {
                        setInfo({loading: false, success: false})
                        console.log("Order failed", e)
                    })
                    cartEmpty(() => {
                        console.log("Cart is emptyed out")
                    })
                    setReload(reload)
                }
            })
            .catch(e => console.log(e))
        })
        .catch(e => console.log(e))
    }

    const showbtnDropIn = () => {
        return (
            <div>
                {
                    info.clientToken !== null && products.products.length > 0 ? 
                    (
                        <div>
                            <DropIn options={{authorization: info.clientToken}} onInstance={instance => (info.instance = instance)}>
                            </DropIn>
                            <button className="btn btn-block btn-success" onClick={onPurchase}>Buy Now</button>
                            
                        </div>
                    ) : 
                    (
                        <h3>Please Login first or someting in cart</h3>
                    )
                    
                }
            </div>
        )
    }

    return (
        <div>
            <h4>Your bill is ${getAmount()}</h4>
            {showbtnDropIn()}
        </div>
    )
}

export default PaymentB;