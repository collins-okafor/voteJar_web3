import React from "react";

const Finished = (props) =>
{
    return (
        <div className="login-container">
            <h1 className="welcome-message">Voting time has ended
                <br>
                </br>
                <br>
                </br>
                You can try again next time</h1>
            {/* <button className="login-button" onClick={props.connectWallet}> Connect Wallet</button> */}
        </div>
    )
}

export default Finished