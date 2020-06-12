import React from 'react'
import Loader from './Loader';
import RecipePromo from './RecipePromo';
import '../style/index-recipes.css';
import '../style/index-home.css';

class BrowseRecipes extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoading: false
        }
        this.url = props.url;
        this.user = props.user;
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

    render() {
        return (
            this.state.isLoading ? <Loader /> :
                this.state.data.length !== 0 ?
                    <div id="browsedRecipesList" className="recipesSection">
                        {
                            this.state.data.map(item =>
                                <RecipePromo user={this.user} item={item} key={item.id} isBrowse={true}/>
                            )} </div> :
                    <img id="noRecipeFound" alt="" src={require('../style/content/Images/no-results.jpg')} />
        )
    }
}

export default BrowseRecipes;