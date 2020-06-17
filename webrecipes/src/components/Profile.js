import React from 'react'
import Loader from './Loader';
import RecipePromo from './RecipePromo';
import '../style/index-recipes.css';
import '../style/index-home.css';
import '../style/profile.css';

class Profile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoading: false,
            user: "",
            isSubscribed: false,
            disableBtn: false,
            subscribers: 0,
            isProfileOwner: false,
            isSubscribeBtnRunning: false,
            username: window.location.href.split('/').pop()
        }
        this.user = props.user;
        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
        this.getLikes = this.getLikes.bind(this);
        this.subscriptionInfo = this.subscriptionInfo.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    async componentWillReceiveProps(nextProps) {
        await this.setState({
            data: [],
            isLoading: false,
            user: "",
            isSubscribed: false,
            disableBtn: false,
            subscribers: 0,
            isProfileOwner: false,
            isSubscribeBtnRunning: false,
            username: window.location.href.split('/').pop()
        })
        this.refresh();
    }

    async componentDidMount() {
        this.refresh();
    }

    async refresh() {
        this.setState({
            isLoading: true
        })
        this.url = `http://localhost:5000/api/user/${this.state.username}/info`;
        var response = await fetch(this.url);
        var fetcheddata = await response.json();
        try {
            let recipes = fetcheddata.data.recipes;
            this.setState({
                user: fetcheddata.data,
                data: [...this.state.data, ...await this.getLikes(recipes)],
                isLoading: false,
                subscribers: fetcheddata.data.subscribers
            })
            this.getLikes();
            this.subscriptionInfo();
        }
        catch{
        }
    }

    async getLikes(recipes) {
        var response = await fetch(`http://localhost:5000/api/user/${this.user.info.unique_name}/favourites`);
        var fetcheddata = await response.json();
        let likedRecipes = [];
        try {
            likedRecipes = [...likedRecipes, ...fetcheddata.data];
            let likedIds = likedRecipes.map(recipe => recipe.id);
            recipes.forEach(recipe => {
                if (likedIds.includes(recipe.id)) {
                    recipe.isLiked = true;
                }
            });
            return recipes;
        }
        catch{

        }
    }

    subscribe() {
        let url = `http://localhost:5000/api/user/${this.user.info.unique_name}/subscribe?creator=${this.state.username}`;

        this.setState({
            isSubscribeBtnRunning: true
        })

        try {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${this.user.token}`
                }
            }).then(x => {
                this.setState({
                    isSubscribed: true,
                    subscribers: this.state.subscribers + 1,
                    isSubscribeBtnRunning: false
                });
            })
        }
        catch {

        };
    }

    unsubscribe() {
        let url = `http://localhost:5000/api/user/${this.user.info.unique_name}/unsubscribe?creator=${this.state.username}`;

        this.setState({
            isSubscribeBtnRunning: true
        })

        try {
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `bearer ${this.user.token}`,
                }
            }).then(x => {
                this.setState({
                    isSubscribed: false,
                    subscribers: this.state.subscribers - 1,
                    isSubscribeBtnRunning: false
                });
            })
        }
        catch {

        };
    }

    async subscriptionInfo() {
        if (this.user.info.unique_name === this.state.username) {
            this.setState({
                isProfileOwner: true
            })
        }
        var response = await fetch(`http://localhost:5000/api/user/${this.user.info.unique_name}/subscriptions`);
        var fetcheddata = await response.json();
        try {
            if (fetcheddata.data.includes(this.state.username)) {
                this.setState({
                    isSubscribed: true
                })
            }
        }
        catch{
        }
    }

    render() {
        return (
            this.state.isLoading ? <Loader /> :
                <div id="profileData">
                    <div id="profileHeader">
                        <div className="imageOverlay"></div>
                        {/* <img alt="profile image" src="" id="profileImg"/> */}
                        <p id="profileImg">{this.state.username.charAt(0).toUpperCase()}</p>
                        <p id="profileName">{this.state.user.name?.toUpperCase()}</p>
                        <p id="profileUsername">{this.state.user.username?.toLowerCase()}</p>
                        <hr />
                        <div id="profileFollowersRecipesNum">
                            <div className="totalRecipes">
                                <p className="number">{this.state.user.recipesCount}</p>
                                <p>Recipes</p>
                            </div>
                            <div className="totalSubs">
                                <p className="number">{this.state.subscribers}</p>
                                <p>Subscribers</p>
                            </div>
                        </div>
                        {this.state.isProfileOwner ? "" :
                            this.state.isSubscribed ?
                                <button className="followBtn followingBtnState"
                                    disabled={this.state.isSubscribeBtnRunning}
                                    onClick={() => this.unsubscribe()}>Unsubscribe</button> :
                                <button className="followBtn followBtnState"
                                    disabled={this.state.isSubscribeBtnRunning}
                                    onClick={() => this.subscribe()}>Subscribe</button>
                        }
                    </div>
                    {
                        //loading user's recipes
                        this.state.data.length !== 0 ?
                            <div>
                                <h1>Recipes</h1>
                                <div id="usersRecipesList" className="recipesSection">
                                    {
                                        this.state.data.map(item =>
                                            <RecipePromo user={this.user} item={item} key={item.id} />
                                        )} </div>

                            </div> :
                            <div></div>
                    }
                </div>
        )
    }
}

export default Profile;