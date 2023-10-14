import React from "react";

const Connected = (props) =>
{
    return (
        <div className="login-container">
            <h1 className="connected-header">Connected to wallet</h1>
            <p className="connected-account">Wallet Account: { props.account}</p>
        </div>
    )
}

export default Connected;