import React from 'react'

class Subscription extends React.Component {
    constructor(props) {
        super(props)

        this.user = props.user;
        this.item = props.item;
        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);

        this.state = {
            isSubscribed: true,
        }
    }

    subscribe(username) {
        let url = `http://localhost:5000/api/user/${this.user.info.unique_name}/subscribe?creator=${username}`;

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
                });
            })
        }
        catch {

        };
    }

    unsubscribe(username) {
        let url = `http://localhost:5000/api/user/${this.user.info.unique_name}/unsubscribe?creator=${username}`;

        try {
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `bearer ${this.user.token}`,
                }
            }).then(x => {
                this.setState({
                    isSubscribed: false,
                });
            })
        }
        catch {

        };
    }

    render() {
        return (
            <div className="followingSection">
                <div className="followingPhoto">{this.item.charAt(0).toUpperCase()}</div>
                <div className="followingUsername">{this.item}</div>

                {this.state.isSubscribed ?
                    <button className="followingBtn"
                        onClick={() => this.unsubscribe(this.item)}>Unsubscribe</button> :
                    <button className="followingBtn followBtn"
                        onClick={() => this.subscribe(this.item)}>Subscribe</button>
                }
            </div>

        )
    }
}

export default Subscription;