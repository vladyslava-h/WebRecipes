import React from 'react'
import Loader from './Loader';
import '../style/index-recipes.css';
import '../style/index-home.css';
import '../style/index-browse.css';
import MealMenu from './MealMenu';
import RecipePromo from './RecipePromo';
import BrowseRecipes from './BrowseRecipes';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';

class Browse extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            meals: [{ id: -1, name: "All" }],
            isLoading: false,
            search: "",
            searchUrl: "",
            meal: -1,
            isSearch: false
        }
        this.user = props.user;
        this.urlRecipes = "http://localhost:5000/api/recipes?username=" + this.user.info.unique_name;
        this.urlMeals = "http://localhost:5000/api/meals";
        this.search = this.search.bind(this);
        this.goBack = this.goBack.bind(this);
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

    async search() {
        this.setState({
            isLoading: true
        })
        let search = document.getElementById("browseSearch").value;
        let url = "http://localhost:5000/api/recipes/search/" + search.replace(/(\s+)/g, '$1') + "?username=" +
            this.user.info.unique_name;
        var response = await fetch(url);
        var fetcheddata = await response.json();
        try {
            this.setState({
                data: fetcheddata.data,
                isLoading: false,
                searchUrl: url,
                search: ": " + search,
                isSearch: true
            })
        }
        catch{
        }
    }

    goBack() {
        this.setState({
            isSearch: false,
            search: ""
        });
    }

    render() {
        return (
            this.state.isLoading ? <Loader /> :
                <div id="browsedRecipes">
                    <div className="form-group browseSearchHeader">
                        {
                            this.state.isSearch ? <img src={require('../style/content/Images/Icons/back.png')}
                                alt="go back" className="backBtn" onClick={this.goBack} /> : ""
                        }
                        <input type="text" className="form-control browseSearch"
                            placeholder={`Discover${this.state.search}`} id="browseSearch"
                            name="search"
                        />
                        <button className="searchBtn" onClick={this.search}>Search</button>
                    </div>
                    <Router>
                        <MealMenu user={this.user} meals={this.state.meals} />
                        <Switch>
                            {
                                this.state.meals.map(item =>
                                    this.state.isSearch ?
                                        this.state.data.length !== 0 ?
                                            this.state.meals.map(item =>
                                                <Route key={item.id} path={`/browse/${item.name}`}
                                                    exact component={() => <BrowseRecipes url={item.id === -1 ? this.state.searchUrl : this.state.searchUrl + `&meal=` + item.id}
                                                        user={this.user} />} />
                                            )
                                            :
                                            <img id="noRecipeFound" alt="" src={require('../style/content/Images/no-results.jpg')} />
                                        :
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