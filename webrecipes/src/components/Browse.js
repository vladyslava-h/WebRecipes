import React from 'react'
import Loader from './Loader';
import '../style/index-recipes.css';
import '../style/index-home.css';
import '../style/index-browse.css';
import MealMenu from './MealMenu';
import BrowseRecipes from './BrowseRecipes';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';

class Browse extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            meals: [{ id: -1, name: "All" }],
            isLoading: false
        }
        this.user = props.user;
        this.urlRecipes = "http://localhost:5000/api/recipes?username=" + this.user.info.unique_name;
        this.urlMeals = "http://localhost:5000/api/meals";
    }

    async componentDidMount() {
        this.setState({
            isLoading: true
        })
        var response = await fetch(this.urlRecipes);
        var responseMeals = await fetch(this.urlMeals);
        var fetcheddata = await response.json();
        var fetcheddataMeals = await responseMeals.json();
        try {
            this.setState({
                data: [...this.state.data, ...fetcheddata.data],
                meals: [...this.state.meals, ...fetcheddataMeals.data],
                isLoading: false
            })
        }
        catch{
        }
    }

    render() {
        return (
            this.state.isLoading ? <Loader /> :
                <div id="browsedRecipes">
                    <div className="form-group browseSearchHeader">
                        <input type="text" className="form-control browseSearch"
                            placeholder="Discover" id="browseSearch"
                        //value={this.state.passwordLogIn}
                        //onChange={this.handleChange}
                        />
                        <button className="searchBtn">Search</button>
                    </div>
                    <Router>
                        <MealMenu user={this.user} meals={this.state.meals} />
                        <Switch>
                            {
                                this.state.meals.map(item =>
                                    <Route key={item.id} path={`/browse/${item.name}`}
                                        exact component={() => <BrowseRecipes url={item.id === -1 ? this.urlRecipes : this.urlRecipes + `&meal=` + item.id}
                                            user={this.user} />} />
                                )
                            }
                        </Switch>
                    </Router>
                </div>

        )
    }
}

export default Browse;