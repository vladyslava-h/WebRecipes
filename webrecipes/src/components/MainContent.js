import React from "react";
import Home from './Home';
import Favourites from './Favourites';
import Recipes from './Recipes';
import Chefs from './Chefs';
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
                    <Route path='/favourites' exact component={() => <Favourites url={`http://localhost:5000/api/user/${this.user.info.unique_name}/favourites`} user={this.user} />} />
                    <Route path='/recipes' exact component={() => <Recipes url={`http://localhost:5000/api/user/${this.user.info.unique_name}/recipes`} user={this.user} />} />
                    <Route path='/subscriptions' exact component={() => <Chefs url={`http://localhost:5000/api/user/${this.user.info.unique_name}/subscriptions`} user={this.user} />} />
                </Switch>
            </main>
        );
    }
}


export default MainContent;