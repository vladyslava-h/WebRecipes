import React from 'react'
import '../style/index-home.css'

class NoContentFound extends React.Component {
    constructor(props) {
        super(props)
        this.messageHeader = props.messageHeader;
        this.message = props.message;
        this.isRecipesPage = props.isRecipesPage;
    }

    render() {
        return (
            <div id="noContentFound">
                <img src={require('../style/content/Images/Icons/chef_transparent.png')} alt="" />
                <div className="message">
                    <p id="noContentFoundMessageHeader">{this.messageHeader}</p>
                    <p id="noContentFoundMessage">{this.message}</p>
                    <button id="goToCreateRecipeBtn" 
                    style={this.isRecipesPage ? { display: "block" } : { display: "none" }}
                    className="pulse-button">Create your first recipe</button>
                </div>
            </div>
        )
    }
}

export default NoContentFound;