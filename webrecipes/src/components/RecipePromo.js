import React from 'react';
import Like from './Like';
import { withRouter } from 'react-router-dom';

class RecipePromo extends React.Component {
    constructor(props) {
        super(props)

        this.user = props.user;
        this.item = props.item;
    }

    render() {
        const elements = [1, 2, 3, 4, 5];
        return (
            <div className="recipeBlock" key={this.item.id}>
                <img className="recipeImg"
                    src={this.item.photo} alt="" />
                <div className="recipeCircleBtn">
                    <div className="under"></div>
                    <Like user={this.user} item={this.item} />
                </div>
                <div className={`recipeTimeBlock recipeTimeBlock${this.item.levelId}`}>
                    <p><span className="recipeTime">{this.item.time}</span>&nbsp;Minutes</p>
                </div>
                <p className="recipeName">{this.item.name}</p>
                <a className="recipeCreator" href={`/profile/${this.item.user.username}`} >By:&nbsp;<span>{this.item.user.username}</span></a>
                <div className="rating">
                    {elements.map((value, index) => {
                        return value <= this.item.mark ? <span key={index}>★</span> : <span key={index}>☆</span>
                    })}
                </div>
            </div>
        )
    }
}

export default withRouter(RecipePromo);