import React from 'react';
import Like from './Like';
import { withRouter } from 'react-router-dom';

class RecipePromo extends React.Component {
    constructor(props) {
        super(props)

        this.user = props.user;
        this.item = props.item;
        this.redirect = this.redirect.bind(this);
        this.redirectToRecipe = this.redirectToRecipe.bind(this);
    }

    redirect() {
        this.props.history.push(`/profile/${this.item.user.username}`)
    }
    
    redirectToRecipe(){
        this.props.history.push(`/recipe/${this.item.id}`)
    }

    render() {
        const elements = [1, 2, 3, 4, 5];

        var name = this.item.name;
        
        if(name.length > 44){
            name = name.substr(0, 40) + '...';
        }

        return (
            <div className="recipeBlock" key={this.item.id}>
                <img className="recipeImg"
                onClick={this.redirectToRecipe}
                    src={this.item.photo === "" ?
                        require('../style/content/Images/default-recipe.png')
                        : this.item.photo} alt="" />
                <div className="recipeCircleBtn">
                    <div className="under"></div>
                    <Like user={this.user} item={this.item} />
                </div>
                <div className={`recipeTimeBlock recipeTimeBlock${this.item.levelId}`}>
                    <p><span className="recipeTime">{this.item.time}</span>&nbsp;Minutes</p>
                </div>
                <p className="recipeName" onClick={this.redirectToRecipe}>{name}</p>
                <p className="recipeCreator" onClick={this.redirect} >By:&nbsp;<span>{this.item.user.username}</span></p>
                <div className="rating">
                    {elements.map((value, index) => {
                        return value <= this.item.mark / this.item.totalMarks ? <span key={index}>★</span> : <span key={index}>☆</span>
                    })}
                </div>
            </div>
        )
    }
}

export default withRouter(RecipePromo);