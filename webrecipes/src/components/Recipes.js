import React from 'react'
import Loader from './Loader';
import NoContentFound from './NoContentFound';
import '../style/index-recipes.css';
import '../style/index-home.css';
import { withRouter } from 'react-router-dom';

class Recipes extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoading: false
        }
        this.url = props.url;
        this.user = props.user;
        this.redirect = this.redirect.bind(this);
    }

    async componentDidMount() {
        this.setState({
            isLoading: true
        })
        var response = await fetch(this.url);
        var fetcheddata = await response.json();
        try {
            this.setState({
                data: [...this.state.data, ...fetcheddata.data],
                isLoading: false
            })
        }
        catch{

        }
    }

    redirect(item) {
        this.props.history.push(`/profile/${item.user.username}`)
    }

    render() {
        const elements = [1, 2, 3, 4, 5];
        return (
            this.state.isLoading ? <Loader /> :
                this.state.data.length !== 0 ?
                    <div id="recipesSection" className="recipesSection">
                        {
                            this.state.data.map(item =>
                                <div className="recipeBlock" data-id={item.id} key={item.id}>
                                    <img className="recipeImg"
                                        src={item.photo === "" ?
                                            require('../style/content/Images/default-recipe.png')
                                            : item.photo} alt="recipe" />
                                    <div className="recipeCircleBtn">
                                        <div className="under"></div>
                                        <div className="recipeRemoveBlock" data-id={item.id}></div>
                                    </div>
                                    <div className={`recipeTimeBlock recipeTimeBlock${item.levelId}`}>
                                        <p><span className="recipeTime">{item.time}</span>&nbsp;Minutes</p>
                                    </div>
                                    <p className="recipeName">{item.name}</p>
                                    <p className="recipeCreator" onClick={() => this.redirect(item)}>By:&nbsp;<span>{item.user.username}</span></p>
                                    <div className="rating">
                                        {elements.map((value, index) => {
                                            return value <= item.mark ? <span key={index}>★</span> : <span key={index}>☆</span>
                                        })}
                                    </div>
                                </div>
                            )} </div> :

                    <NoContentFound messageHeader="You haven’t uploaded any recipes yet"
                        message=""
                        isRecipesPage={true} />
        )
    }
}

export default withRouter(Recipes);