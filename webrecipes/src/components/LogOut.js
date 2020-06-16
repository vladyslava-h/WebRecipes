import React from "react";

class LogOut extends React.Component {
    logOut() {
        window.localStorage.removeItem('webrecipesapicredentials');
        window.location.reload(false);
    }

    render() {
        return (
            <div id="logout">
                <p id="logoutBtn" onClick={this.logOut} className="dropdown-item">Log Out</p>
            </div>
        )
    }
}


export default LogOut;