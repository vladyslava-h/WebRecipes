import React from "react";
import Loader from "./Loader";
import NoContentFound from './NoContentFound';
import '../style/recipe.css'
import '../style/checkbox.css'

class Recipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      user: "",
      recipe: null,
      recipeId: window.location.href.split('/').pop()
    };

    this.user = props.user;
    //this.uploadImage = this.uploadImage.bind(this);
    this.refresh = this.refresh.bind(this);
}

async componentDidMount() {
    this.refresh();
}

async refresh() {
    console.log(this.user);
    this.url = `http://localhost:5000/api/recipes/getrecipe/${this.state.recipeId}?username=${this.user.info.unique_name}`;
    try {
        var response = await fetch(this.url);
        var fetcheddata = await response.json();
        console.log(fetcheddata.data);
        this.setState({
            recipe: fetcheddata.data,
           // data: [...this.state.data, ...await this.getLikes(recipes)],
            isLoading: false
        })
        //this.getLikes();
    }
    catch(ex){
        console.log(ex)
        this.setState({
            recipe: undefined,
            isLoading: false
        })
    }
}
  
  render() {
    var ingredientsCounter = 0;
    var stepsCounter = 0;
    var ingredients = null;
    var steps = null;
    const elements = [1, 2, 3, 4, 5];

    if(this.state.recipe != null){
      ingredients = this.state.recipe.ingredients.split('\n');
      steps = this.state.recipe.directions.split('\n');
      ingredients = ingredients.slice(0, -1);
      steps = steps.slice(0, -1);
    }

    return this.state.isLoading ? <Loader /> :
    this.state.recipe === undefined ? <NoContentFound message="404" /> :
    <div id="recipe">
        <div className="recipe-main">
            <div className="recipe-title-section">
              <p className="recipe-meal-type">{this.state.recipe.meal}</p>
              <p className="recipe-name">{this.state.recipe.name}</p>
              <div className="rating">
                    {elements.map((value, index) => {
                        return value <= this.state.recipe.mark ? <span key={index}>★</span> : <span key={index}>☆</span>
                    })}
                </div>
            </div>

            <h1 className="sub-main-title">Method</h1>
            <div className="recipe-method">
            {
                  steps.map(item =>
                      <div className="method" key={stepsCounter + "-ingredient"}>
                        <p className="stepCounterSimple">{++stepsCounter}.</p>
                        <p className="method-desc">{item}</p>
                      </div>
                )}
            </div>

        </div>



        <div className="recipe-bar">
          <div className="bar-top">
            <div className="bar-item">
                <img src={require('../style/content/Images/Icons/stopwatch.png')} alt=""/>
                <p>{this.state.recipe.time} minutes</p>
            </div>
            <div className="bar-item">
                <img src={require('../style/content/Images/Icons/medal.png')} alt=""/>
                <p>{this.state.recipe.level}</p>
            </div>
            <div className="bar-item">
                <img src={require('../style/content/Images/Icons/chef.png')} alt=""/>
                <p>{this.state.recipe.user.username}</p>
            </div>

            <h1 className="sub-main-title">Ingredients</h1>
            </div>

            <div className="ingredients-section"> 
                {
                  ingredients.map(item =>
                    <div key={ingredientsCounter + "-ingredient"}>
                      <label class="pure-material-checkbox">
                      <input type="checkbox"/>
                      <span>{item}</span>
                      </label>
                    </div>
                )}
            </div>

            <div className="bar-menu">
                  <img src={require('../style/content/Images/Icons/shopping-basket.png')} alt=""/>
                  <img src={require('../style/content/Images/Icons/comment.png')} alt=""/>
                  <img src={require('../style/content/Images/Icons/heart-white-outlined.png')} alt=""/>
            </div>
        </div>
    </div>;
  }
}

export default Recipe;
