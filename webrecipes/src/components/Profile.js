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
            isSubscribeBtnRunning: false
        }
        this.user = props.user;
        this.username = window.location.href.split('/').pop();
        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
        this.url = `http://localhost:5000/api/user/${this.username}/info`;
    }

    async componentDidMount() {
        this.setState({
            isLoading: true
        })
        var response = await fetch(this.url);
        var fetcheddata = await response.json();
        try {
            this.setState({
                user: fetcheddata.data,
                data: [...this.state.data, ...fetcheddata.data.recipes],
                isLoading: false,
                subscribers: fetcheddata.data.subscribers
            })
        }
        catch{
        }
    }

    subscribe() {
        let url = `http://localhost:5000/api/user/${this.user.info.unique_name}/subscribe?creator=${this.username}`;

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
        let url = `http://localhost:5000/api/user/${this.user.info.unique_name}/unsubscribe?creator=${this.username}`;

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

    render() {
        return (
            this.state.isLoading ? <Loader /> :
                <div id="profileData">
                    <div id="profileHeader">
                        <div className="imageOverlay"></div>
                        {/* <img alt="profile image" src="" id="profileImg"/> */}
                        <p id="profileImg">{this.username.charAt(0).toUpperCase()}</p>
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
                        {this.state.isSubscribed ?
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
                            <h1>nothing to show</h1>
                    }
                </div>
        )
    }
}

export default Profile;