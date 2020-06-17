import React from 'react';
import LogOut from './LogOut';
import { withRouter } from 'react-router-dom';

class DropDownMenu extends React.Component {
    constructor(props) {
        super(props)
        this.user = props.user;

        this.state = {
            isOpen: false
        };

        this.redirect = this.redirect.bind(this);
    }

    toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

    redirect() {
        this.props.history.push(`/profile/${this.user.info.unique_name}`)
    }

    render() {
        const menuClass = `dropdown-menu${this.state.isOpen ? " show" : ""}`;
        return (
            <div className="dropdown" onClick={this.toggleOpen}>
                <button
                    className="btn btn-settings"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true">
                    {this.user.info.unique_name}
                </button>
                <div className={`${menuClass} drop-menu`} aria-labelledby="dropdownMenuButton">
                    <button className="dropdown-item" onClick={this.redirect}>
                        View Profile</button>
                    <LogOut />
                </div>
            </div>
        );
    }
}


export default withRouter(DropDownMenu);