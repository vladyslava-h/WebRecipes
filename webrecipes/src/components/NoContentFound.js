import React from 'react'
import '../style/index-home.css'
import { withRouter } from 'react-router-dom'

class NoContentFound extends React.Component {
    constructor(props) {
        super(props)
        this.messageHeader = props.messageHeader;
        this.message = props.message;
        this.isRecipesPage = props.isRecipesPage;
        this.redirect = this.redirect.bind(this);
    }

    redirect() {
        this.props.history.push("/create")
    }

    render() {
        return (
            this.message === "404" ?
                <div id="noContentFound">
                    <img src={require('../style/content/Images/noPageFound.jpg')} alt="noPageFound" className="noPageFound" />
                </div>
                :
                <div id="noContentFound">
                    <img src={require('../style/content/Images/Icons/chef_transparent.png')} alt="" />
                    <div className="message">
                        <p id="noContentFoundMessageHeader">{this.messageHeader}</p>
                        <p id="noContentFoundMessage">{this.message}</p>
                        <button id="goToCreateRecipeBtn"
                            onClick={this.redirect}
                            style={this.isRecipesPage ? { display: "block" } : { display: "none" }}
                            className="pulse-button">Create your first recipe</button>
                    </div>
                </div>
        )
    }
}

export default withRouter(NoContentFound);