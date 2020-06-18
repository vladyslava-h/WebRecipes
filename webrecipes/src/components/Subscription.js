import React from 'react';
import { withRouter } from 'react-router-dom';

class Subscription extends React.Component {
    constructor(props) {
        super(props)

        this.user = props.user;
        this.item = props.item;
        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);

        this.state = {
            isSubscribed: true,
            isProfileOwner: false,
            disableBtn: false,
            photo: null
        }
        this.redirect = this.redirect.bind(this);
        this.getInfo = this.getInfo.bind(this);
    }

    async componentDidMount() {
        this.subscriptionInfo();
        this.getInfo();
    }

    async subscriptionInfo() {
        if (this.user.info.unique_name === this.item) {
            this.setState({
                isProfileOwner: true
            })
        }
        var response = await fetch(`http://localhost:5000/api/user/${this.user.info.unique_name}/subscriptions`);
        var fetcheddata = await response.json();
        try {
            if (fetcheddata.data.includes(this.item)) {
                this.setState({
                    isSubscribed: true
                })
            }
            else {
                this.setState({
                    isSubscribed: false
                })
            }
        }
        catch{
        }
    }

    subscribe(username) {
        let url = `http://localhost:5000/api/user/${this.user.info.unique_name}/subscribe?creator=${username}`;

        this.setState({
            disableBtn: true
        });

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
                    disableBtn: false
                });
            })
        }
        catch {

        };
    }

    unsubscribe(username) {
        let url = `http://localhost:5000/api/user/${this.user.info.unique_name}/unsubscribe?creator=${username}`;

        this.setState({
            disableBtn: true
        });

        try {
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `bearer ${this.user.token}`,
                }
            }).then(x => {
                this.setState({
                    isSubscribed: false,
                    disableBtn: false
                });
            })
        }
        catch {

        };
    }

    redirect() {
        this.props.history.push(`/profile/${this.item}`)
    }

    async getInfo() {
        this.url = `http://localhost:5000/api/user/${this.item}/info`;
        try {
            var response = await fetch(this.url);
            var fetcheddata = await response.json();
            this.setState({
                photo: fetcheddata.data.photo
            })
        }
        catch{
        }
    }

    render() {
        return (
            <div className="followingSection">
                <div className="followingPhoto">
                    {
                        this.state.photo !== null ?
                            <img alt="user" src={this.state.photo} id="profileImg" /> :
                            <p>{this.item.charAt(0).toUpperCase()}</p>
                    }
                </div>
                <p className="followingUsername" onClick={this.redirect}>{this.item}</p>

                {this.state.isProfileOwner ? " " :
                    this.state.isSubscribed ?
                        <button className="followingBtn"
                            disabled={this.state.disableBtn}
                            onClick={() => this.unsubscribe(this.item)}>Unsubscribe</button> :
                        <button className="followingBtn followBtn"
                            disabled={this.state.disableBtn}
                            onClick={() => this.subscribe(this.item)}>Subscribe</button>
                }
            </div>

        )
    }
}

export default withRouter(Subscription);