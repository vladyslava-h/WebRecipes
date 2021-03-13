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
      userMark: 0,
      mark: 0,
      totalMarks: 0,
      recipeId: window.location.href.split('/').pop()
    };

    this.like = this.like.bind(this);
    this.unlike = this.unlike.bind(this);

    this.user = props.user;
    this.refresh = this.refresh.bind(this);
    this.redirect = this.redirect.bind(this);
    this.rate = this.rate.bind(this);
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
            mark: fetcheddata.data.mark,
            totalMarks: fetcheddata.data.totalMarks,
            userMark: fetcheddata.data.userMark,
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

changeMenuSelection(option){
  if(option == "comment"){
    document.getElementById("recipeBarBasicInfo").classList.add("d-none");
    document.getElementById("recipeBarComments").classList.remove("d-none");
  }
  else{
    document.getElementById("recipeBarBasicInfo").classList.remove("d-none");
    document.getElementById("recipeBarComments").classList.add("d-none");
  }
}

async rate(value){
  let url = `http://localhost:5000/api/recipes/rate/${this.state.recipeId}?username=${this.user.info.unique_name}&value=${value}&prev=${this.state.userMark}`;

  this.setState({
      userMark: value
  });

  try {
    var response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `bearer ${this.user.token}`
          }
        });
      var fetcheddata = await response.json();
      this.setState({
        mark: fetcheddata.data.mark,
        totalMarks: fetcheddata.data.totalMarks
    });
  }
  catch(ex) {
    console.log(ex);
  };
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
      ingredients = this.state.recipe.ingredients.split('\n').filter(x => x);
      steps = this.state.recipe.directions.split('\n').filter(x => x);

      if(this.state.totalMarks > 1){
        rating_text = `based on ${this.state.totalMarks} reviews`;
      }
      else if (this.state.totalMarks == 1){
        rating_text = `based on ${this.state.totalMarks} review`;
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
                        return value <= ((this.state.mark / this.state.totalMarks) == undefined? 0 : this.state.mark / this.state.totalMarks) ? <span key={index}>★</span> : <span key={index}>☆</span>
                    })
                  }

                    {
                      console.log(isNaN(this.state.mark / this.state.totalMarks))
                    }

                    <span className="based-span"><span className="accent-text">{isNaN(this.state.mark / this.state.totalMarks)? 0 : (this.state.mark / this.state.totalMarks)}</span>({rating_text})</span>
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
          <div id="recipeBarBasicInfo" className="recipe-bar-section">
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
          </div>
          {/* COMMMENT SECTION --------------------------------------------------------------------------------------------------- */}
          <div id="recipeBarComments" className="recipe-bar-section d-none">
          <div className="userRating">
                    <p className="accent-text">Your Rating: </p>
                    <div className="userRatingStart">
                    {elements.map((value, index) => {
                      return value <= this.state.userMark ? <span key={index} onClick={() => this.rate(index + 1)}>★</span> :
                       <span key={index} onClick={() => this.rate(index + 1)}>☆</span>
                    })}
                    </div>
              </div>
            <div className="comments">
                  <div className="commentBubble">
                    <div class="commentCreator">
                      <img src="https://i.pinimg.com/564x/e0/73/4c/e0734c4ed53a4dacde032be644c7abc7.jpg" alt=""/>
                      <p>masterchef</p>
                    </div>
                    <p>Whoa!! This is amazing. So easy to make.</p>
                    </div>

                  <div className="commentBubble">
                    <div class="commentCreator">
                      <img alt="" src="https://i.pinimg.com/564x/ed/e1/c7/ede1c74b402f072efaf083ec8b3b9040.jpg"/>
                      <p>ella</p>
                    </div>
                    <p>I'm not sure why, but I've noticed that with honey
                    it tastes way more better. but i guess it's just personal preferences..</p>
                    </div>

                    <div className="commentBubble">
                    <div class="commentCreator">
                      <img alt="" src="https://i.pinimg.com/564x/36/0c/f7/360cf7ac7e7b9f1441d0948e6ab83f07.jpg"/>
                      <p>hope</p>
                    </div>
                    <p>Love this one :)</p>
                    </div>
            </div>
            <div className="commentSectionFooter">
              <input autoComplete="false" id="comment" placeholder="Type your comment here"/>
            </div>
          </div>

          <div className="bar-menu">
                  <img src={require('../style/content/Images/Icons/shopping-basket.png')} alt="" onClick={() => this.changeMenuSelection("basicInfo")}/>
                  <img src={require('../style/content/Images/Icons/comment.png')} alt="" onClick={() => this.changeMenuSelection("comment")}/>
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
