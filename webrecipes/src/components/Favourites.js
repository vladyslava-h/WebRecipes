import React from 'react'
import Loader from './Loader';
import RecipePromo from './RecipePromo';
import NoContentFound from './NoContentFound';
import '../style/index-recipes.css';
import '../style/index-home.css';

class Favourites extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoading: false,
            current_page: 1,
            pages: 0
        }
        this.url = props.url;
        this.user = props.user;

        this.loadInfo = this.loadInfo.bind(this);
        this.changePage = this.changePage.bind(this);
    }

    async componentDidMount() {
        await this.loadInfo();
    }

    async loadInfo(){
        this.setState({
            isLoading: true
        })
        var response = await fetch(this.url + "?page=" + this.state.current_page);
        var fetcheddata = await response.json();
        try {
            this.setState({
                data: fetcheddata.data,
                isLoading: false,
                pages: fetcheddata.pages
            })
        }
        catch{

        }
    }

    async changePage(index){
        await this.setState({
            current_page: index
        })
        this.loadInfo();
    }

    render() {
        var pages = [];

        if(this.state.pages > 0){
            pages = [];
            for (let i = 1; i < this.state.pages + 2; i++) {
                pages.push(i); 
            }
        }

        return (
            this.state.isLoading ? <Loader /> :
                this.state.data.length !== 0 ? <div className="recipesSectionMain">
                    <div id="recipesSection" className="recipesSection">
                        {
                            this.state.data.map(item =>
                                <RecipePromo user={this.user} item={item} key={item.id} />
                            )} 
                            
                            </div> 
                            {
                                this.state.pages > 0 ? 
                                <div className="pagesSection">
                                    {
                                        pages.map(x =>
                                            <div onClick={() => this.changePage(x)} key={x + "-paginationBtn"}
                                            className={this.state.current_page === x ?  "paginationBtn active" : "paginationBtn"} id={x+"-paginationBtn"}>
                                                {x}
                                            </div>)
                                    }
                                </div>  : <div></div>
                            }
                            </div>:

                    <NoContentFound messageHeader="Save your Favourite Recipes"
                        message="We'll collect all of your likes here for you to revisit anytime!"
                        isRecipesPage={false} />
        )
    }
}

export default Favourites;