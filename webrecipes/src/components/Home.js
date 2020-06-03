import React from 'react'
import Loader from './Loader';
import RecipePromo from './RecipePromo';
import NoContentFound from './NoContentFound';
import '../style/index-recipes.css';
import '../style/index-home.css';

class Home extends React.Component {
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
                    <div id="recipesSection" className="recipesSection">
                        {
                            this.state.data.map(item =>
                                <RecipePromo user={this.user} item={item} key={item.id} />
                            )} </div> :

                    <NoContentFound messageHeader="This is your Home Page"
                        message="When you follow some users their latest posts will show up here!"
                        isRecipesPage={false} />
        )
    }
}

export default Home;