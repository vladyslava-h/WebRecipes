import React from "react";
import Home from './Home';
import { Route, Switch } from 'react-router-dom';

class MainContent extends React.Component {

    constructor(props){
        super(props)
        this.user = props.user;
    }

    render() {
        return (
            <main>
                <Switch>
                    <Route path='/' exact component={() => <Home url={`http://localhost:5000/api/user/${this.user.info.unique_name}/home`} user={this.user} />} />
                </Switch>
            </main>
        );
    }
}


export default MainContent;