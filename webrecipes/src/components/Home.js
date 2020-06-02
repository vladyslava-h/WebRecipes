import React from 'react'
import Loader from './Loader';
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
            alert("Server error!") //change !!!
        }
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
                                        src={item.photo} alt="" />
                                    <div className="recipeCircleBtn">
                                        <div className="under"></div>
                                        {item.isLiked ?
                                            <div className="recipeLikeBlock recipeLiked" data-id={item.id}></div> :
                                            <div className="recipeLikeBlock" data-id={item.id}></div>}
                                    </div>
                                    <div className={`recipeTimeBlock recipeTimeBlock${item.levelId}`}>
                                        <p><span className="recipeTime">{item.time}</span>&nbsp;Minutes</p>
                                    </div>
                                    <p className="recipeName">{item.name}</p>
                                    <p className="recipeCreator">By:&nbsp;<span>{item.user.username}</span></p>
                                    <div className="rating">
                                        {elements.map((value, index) => {
                                            return value <= item.mark ? <span key={index}>★</span> : <span key={index}>☆</span>
                                        })}
                                    </div>
                                </div>
                            )} </div> :

                    <NoContentFound messageHeader="This is your Home Page"
                        message="When you follow some users their latest posts will show up here!"
                        isRecipesPage={false} />
        )
    }
}

export default Home;