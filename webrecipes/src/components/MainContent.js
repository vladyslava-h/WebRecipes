import React from "react";
import { Route, Switch } from 'react-router-dom';

function MainContent() {

    return (
        <Switch>
            <main>
                {/* <Route path='/' exact component={() => <Home url="http://localhost:5000/api/user/ella/home" />} /> */}
            </main>
        </Switch>
    );
}

export default MainContent;