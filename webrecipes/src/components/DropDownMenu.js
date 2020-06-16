import React from 'react';
import LogOut from './LogOut';

class DropDownMenu extends React.Component {
    constructor(props) {
        super(props)
        this.user = props.user;

        this.state = {
            isOpen: false
        };
    }

    toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

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
                    <a className="dropdown-item"  href={`/profile/${this.user.info.unique_name}`}>
                        View Profile</a>
                    <LogOut />
                </div>
            </div>
        );
    }
}


export default DropDownMenu;