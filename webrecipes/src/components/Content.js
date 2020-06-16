import React from "react";
import Menu from './Menu';
import MainContent from './MainContent';
import UserInfo from './UserInfo';
import DropDownMenu from './DropDownMenu';
import { BrowserRouter as Router } from 'react-router-dom';
import Access from "./Access";
import '../style/index-sidebar.css';
import '../style/index-home.css';

class Content extends React.Component {
    constructor(props) {
        super(props)
        this.user = new UserInfo();
    }

    render() {
        return (
            this.user.getUserInfo() === undefined ?
                <Access /> :
                <>
                    <DropDownMenu user={this.user}/>
                    <Router>
                        <div className="page-container">
                            <Menu user={this.user} />
                            <div id="mainContent">
                                <MainContent user={this.user} />
                            </div>
                        </div>
                    </Router>
                </>
        )
    }
}


export default Content;