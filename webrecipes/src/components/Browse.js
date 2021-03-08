import React from 'react'
import Loader from './Loader';
import '../style/index-recipes.css';
import '../style/index-home.css';
import '../style/index-browse.css';
import RecipePromo from './RecipePromo';
import Subscription from './Subscription';

class Browse extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            meals: [{ id: -1, name: "All" }],
            selectedMeal: null,
            isLoading: false,
            search: "",
            searchUrl: "",
            searchedValue: "",
            meal: -1,
            isSearch: false,
            browseRecipes: true,
            browseUsers: false,
            topUsers: [],
            isSearching: false,
            searchedUsers: [],
            pages: 0,
            current_page: 1
        }
        this.user = props.user;
        this.urlRecipes = "http://localhost:5000/api/recipes?username=" + this.user.info.unique_name;
        this.urlMeals = "http://localhost:5000/api/meals";
        this.urlTopUsers = "http://localhost:5000/api/users/top";
        this.search = this.search.bind(this);
        this.searchUsers = this.searchUsers.bind(this);
        this.goBack = this.goBack.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.browseRecipes = this.browseRecipes.bind(this);
        this.browseUsers = this.browseUsers.bind(this);
        this.changeMeal = this.changeMeal.bind(this);
        this.changePage = this.changePage.bind(this);

        window.location.hash = "all";
    }

    async componentDidMount() {
        this.setState({
            isLoading: true,
        })
        var response = await fetch(this.urlRecipes);
        var responseMeals = await fetch(this.urlMeals);
        var responseTopUsers = await fetch(this.urlTopUsers);
        var fetcheddata = await response.json();
        var fetcheddataMeals = await responseMeals.json();
        var fetcheddataTopUsers = await responseTopUsers.json();
        try {
            this.setState({
                data: [...this.state.data, ...fetcheddata.data],
                meals: [...this.state.meals, ...fetcheddataMeals.data],
                selectedMeal: this.state.meals[0],
                pages: fetcheddata.pages,
                topUsers: [...this.state.topUsers, ...fetcheddataTopUsers.data],
                isLoading: false,
            })

        }
        catch{
        }
    }


    async search() {
        this.setState({
            isSearching: true
        })

        let isSearch = true;
        let url = "http://localhost:5000/api/recipes/search/" + this.state.searchedValue.replace(/(\s+)/g, '$1') + "?username=" +
            this.user.info.unique_name;

        if (this.state.searchedValue === "") {
            url = this.urlRecipes;
            isSearch = false;
        }

        if (this.state.selectedMeal.id !== -1) {
            url += "&meal=" + this.state.selectedMeal.id;
        }

        url+= "&page=" + this.state.current_page;

        var response = await fetch(url);
        var fetcheddata = await response.json();
        try {
            this.setState({
                data: fetcheddata.data,
                isSearching: false,
                searchUrl: url,
                pages: fetcheddata.pages,
                search: this.state.searchedValue !== "" ? ": " + this.state.searchedValue : "",
                isSearch: isSearch
            })
        }
        catch{
        }
    }

    async searchUsers() {
        this.setState({
            isSearching: true
        })
        let url = "http://localhost:5000/api/users/search/" + this.state.searchedValue.replace(/(\s+)/g, '$1');
        var response = await fetch(url);
        var fetcheddata = await response.json();
        try {
            this.setState({
                searchedUsers: fetcheddata.data ?? [],
                isSearching: false,
                searchUrl: url,
                search: this.state.searchedValue !== "" ? ": " + this.state.searchedValue : "",
                isSearch: true
            })
        }
        catch{
        }
    }

    async goBack() {
        await this.setState({
            isSearch: false,
            search: "",
            searchedValue: ""
        });
        if (this.state.browseRecipes) {
            this.search();
        }
    }

    async handleKeyPress(event) {
        if (event.key === 'Enter') {
            var search = document.getElementById("browseSearch").value;
            await this.setState({
                searchedValue: search
            })
            document.getElementById("browseSearch").value = "";
            document.getElementById("browseSearch").blur();

            this.state.browseRecipes ? this.search() : this.searchUsers();
        }
    }

    browseRecipes() {
        this.setState({
            browseRecipes: true,
            browseUsers: false,
            current_page: 1
        })

        if (this.state.isSearch) {
            this.search();
        }
    }

    browseUsers() {
        this.setState({
            browseRecipes: false,
            browseUsers: true
        })

        if (this.state.isSearch) {
            this.searchUsers();
        }
    }

    async changeMeal(item) {
        window.location.hash = item.name.toLowerCase();
        await this.setState({
            selectedMeal: item,
            current_page: 1
        })
        this.search();
    }

    async changePage(index){
        await this.setState({
            current_page: index
        })
        this.search();
    }

    render() {

        var pages = [];

        if(this.state.pages !== 0){
            pages = [];
            for (let i = 1; i < this.state.pages + 2; i++) {
                pages.push(i);               
            }
        }

        return (
            this.state.isLoading ? <Loader /> :
            
                <div id="browsedRecipes">
                    <div className="form-group browseSearchHeader">
                        {
                            this.state.isSearch ? <img src={require('../style/content/Images/Icons/back.png')}
                                alt="go back" className="backBtn" onClick={this.goBack} /> : ""
                        }
                        <input type="text" autoComplete="off" className="form-control browseSearch accent-text"
                            placeholder={`Discover${this.state.search}`} id="browseSearch"
                            name="search"
                            onKeyPress={this.handleKeyPress}
                        />
                        <div id="searchBtnSection">
                            <button className={`btn ${this.state.browseRecipes ? "browse-active-btn" : ""}`}
                                onClick={this.browseRecipes}
                            >Recipes</button>
                            <button className={`btn ${this.state.browseUsers ? "browse-active-btn" : ""}`}
                                onClick={this.browseUsers}
                            >Users</button>
                        </div>
                    </div>
                    {this.state.browseRecipes ?
                        <div>
                            <div id="meals">
                                {
                                    this.state.meals.map(item =>
                                        <div className={this.state.selectedMeal === item ? "meal meal-active" : "meal"}
                                            key={item.id}
                                            onClick={() => this.changeMeal(item)}>
                                            <p>{item.name}</p>
                                        </div>
                                    )
                                }
                            </div>
                            {
                                this.state.isSearching ? <Loader /> :
                                    this.state.data.length !== 0 ?
                                        <div id="browsedRecipesList" className="recipesSection">
                                            {
                                                this.state.data.map(item =>
                                                    <RecipePromo user={this.user} item={item} key={item.id} isBrowse={true} />
                                                )} </div> :
                                        <img id="noRecipeFound" alt="" src={require('../style/content/Images/no-results.jpg')} />
                            }

                            {
                                this.state.pages !== 0 ? 
                                <div className="pagesSection">
                                    {
                                        pages.map(x =>
                                            <div onClick={() => this.changePage(x)} key={x + "-paginationBtn"}
                                            className={this.state.current_page === x ?  "paginationBtn active" : "paginationBtn"} id={x+"-paginationBtn"}>
                                                {x}
                                            </div>)
                                    }
                                </div>  : <div></div>
                            }
                        </div>
                        :
                        <div id="usersSection">
                            {
                                this.state.isSearching ? <Loader /> :
                                    this.state.isSearch ?
                                        this.state.searchedUsers.length !== 0 ?
                                            <div>
                                                <div>
                                                    <div className="usersList">
                                                        {
                                                            this.state.searchedUsers.map(item =>
                                                                <Subscription item={item.username} user={this.user} key={`user-${item.id}`} />
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                            : <img id="noRecipeFound" alt="" src={require('../style/content/Images/no-results.jpg')} key={`not-found-user`} />
                                        :
                                        this.state.topUsers.length !== 0 ?
                                            <div>
                                                <p className="title">Top 5 Users</p>
                                                <div className="usersList">
                                                    {
                                                        this.state.topUsers.map(item =>
                                                            <Subscription item={item.username} user={this.user} key={`top-user-${item.id}`} />
                                                        )}
                                                </div>
                                            </div>
                                            : <img id="noRecipeFound" alt="" src={require('../style/content/Images/no-results.jpg')} key={`not-found-user`} />
                            }
                        </div>
                    }

                </div>

        )
    }
}

export default Browse;