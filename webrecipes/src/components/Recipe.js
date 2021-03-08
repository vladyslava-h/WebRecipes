import React from "react";
import Loader from "./Loader";
import NoContentFound from './NoContentFound';
import '../style/recipe.css'
import '../style/checkbox.css'
import { withRouter } from 'react-router-dom';

class Recipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      user: "",
      recipe: null,
      isLiked: false,
      recipeId: window.location.href.split('/').pop()
    };

    this.like = this.like.bind(this);
    this.unlike = this.unlike.bind(this);

    this.user = props.user;
    //this.uploadImage = this.uploadImage.bind(this);
    this.refresh = this.refresh.bind(this);
    this.redirect = this.redirect.bind(this);
}

like() {
  let id = this.state.recipe.id;
  let url = `http://localhost:5000/api/user/${this.user.info.unique_name}/like?id=${id}`;

  this.setState({
      isRunning: true
  });

  try {
      fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `bearer ${this.user.token}`
          }
      }).then(x => {
          this.setState({
              isLiked: true,
              isRunning: false
          });
      })
  }
  catch {

  };
}

unlike() {
  let id = this.state.recipe.id;
  let url = `http://localhost:5000/api/user/${this.user.info.unique_name}/unlike?id=${id}`;

  this.setState({
      isRunning: true
  });

  try {
      fetch(url, {
          method: 'DELETE',
          headers: {
              'Authorization': `bearer ${this.user.token}`,
          }
      }).then(x => {
          this.setState({
              isLiked: false,
              isRunning: false
          });
      })
  }
  catch {

  };
}

async componentDidMount() {
    this.refresh();
}

async refresh() {
    this.url = `http://localhost:5000/api/recipes/getrecipe/${this.state.recipeId}?username=${this.user.info.unique_name}`;
    try {
        var response = await fetch(this.url);
        var fetcheddata = await response.json();
        this.setState({
            recipe: fetcheddata.data,
           // data: [...this.state.data, ...await this.getLikes(recipes)],
            isLoading: false,
            isLiked: fetcheddata.data.isLiked
        })
        //this.getLikes();
    }
    catch(ex){
        this.setState({
            recipe: undefined,
            isLoading: false
        })
    }
}

redirect() {
  this.props.history.push(`/profile/${this.state.recipe.user.username}`)
}
  
  render() {
    var ingredientsCounter = 0;
    var stepsCounter = 0;
    var ingredients = null;
    var steps = null;

    var rating_text = "no reviews"
    //var avgMark = this.state.recipe.mark;
    const elements = [1, 2, 3, 4, 5];

    if(this.state.recipe != null){
      ingredients = this.state.recipe.ingredients.split('\n');
      steps = this.state.recipe.directions.split('\n');

      if(ingredients.lenght > 1){
        ingredients = ingredients.slice(0, -1);
      }
      if(steps.lenght > 1){
        steps = steps.slice(0, -1);
      }

      if(this.state.recipe.totalMarks > 1){
        rating_text = `based on ${this.state.recipe.totalMarks} reviews`;
      }
      else if (this.state.recipe.totalMarks == 1){
        rating_text = `based on ${this.state.recipe.totalMarks} review`;
      }
  
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

                    <span className="based-span">{rating_text}</span>
                </div>
            </div>

            <h1 className="sub-main-title">Method</h1>
            <div className="recipe-method">
            {
                  steps.map(item =>
                      <div className="method" key={stepsCounter + "-step"}>
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
                <p  onClick={this.redirect}>{this.state.recipe.user.username}</p>
            </div>

            <h1 className="sub-main-title">Ingredients</h1>
            </div>

            <div className="ingredients-section"> 
                {
                  ingredients.map(item =>
                    <div key={++ingredientsCounter + "-ingredient"}>
                      <label className="pure-material-checkbox">
                      <input type="checkbox"/>
                      <span>{item}</span>
                      </label>
                    </div>
                )}
            </div>

            <div className="bar-menu">
                  <img src={require('../style/content/Images/Icons/shopping-basket.png')} alt=""/>
                  <img src={require('../style/content/Images/Icons/comment.png')} alt=""/>
                  {
                    this.state.isLiked ? 
                    <img id="like" onClick={this.unlike} src={require('../style/content/Images/Icons/heart-white.png')} alt=""/> :
                    <img id="like" onClick={this.like} src={require('../style/content/Images/Icons/heart-white-outlined.png')} alt=""/> 
                  }
            </div>
        </div>
    </div>;
  }
}

export default withRouter(Recipe);
