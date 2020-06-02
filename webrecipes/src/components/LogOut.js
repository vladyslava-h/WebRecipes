import React from "react";

class LogOut extends React.Component {
    constructor(props) {
        super(props)
    }

    logOut() {
        window.localStorage.removeItem('webrecipesapicredentials');
        window.location.reload(false);
    }

    render() {
        return (
            <div id="logout">
                <p id="logoutBtn" onClick={this.logOut}>Log Out</p>
            </div>
        )
    }
}


export default LogOut;