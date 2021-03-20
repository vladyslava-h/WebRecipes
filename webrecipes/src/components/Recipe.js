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
      comments: [],
      recipeId: window.location.href.split('/').pop()
    };

    this.like = this.like.bind(this);
    this.unlike = this.unlike.bind(this);

    this.user = props.user;
    this.refresh = this.refresh.bind(this);
    this.redirect = this.redirect.bind(this);
    this.rate = this.rate.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.postComment = this.postComment.bind(this);
    this.getComments = this.getComments.bind(this);
    this.removeComment = this.removeComment.bind(this);
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
            //isLoading: false,
            mark: fetcheddata.data.mark,
            totalMarks: fetcheddata.data.totalMarks,
            userMark: fetcheddata.data.userMark,
            isLiked: fetcheddata.data.isLiked
        })
        this.getComments();
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

redirect(username) {
  this.props.history.push(`/profile/${username}`)
}

handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    this.postComment();   
  }
}

async getComments(){
  this.url = `http://localhost:5000/api/comment/all/${this.state.recipe.id}`;
  try {
      var response = await fetch(this.url);
      var fetcheddata = await response.json();
      this.setState({
          isLoading: false,
          comments: fetcheddata.data
      })
  }
  catch(ex){
      this.setState({
          isLoading: false
      })
  }
}

async removeComment(id){
  var url = `http://localhost:5000/api/comment/delete/${id}`;
  try {
      var response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `bearer ${this.user.token}`,
        }
    });
    var fetcheddata = await response.json();
        this.setState({
          isLoading: false,
          comments: fetcheddata.data
        });
  }
  catch(ex){
    console.log(ex);
      this.setState({
          isLoading: false
      })
  }

}

async postComment(){
  let url = `http://localhost:5000/api/comment/comment/${this.state.recipeId}?username=${this.user.info.unique_name}&value=${document.getElementById("comment").value}`;
  document.getElementById("comment").value = "";

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
        comments: fetcheddata.data
      });
  }
  catch(ex) {
    console.log(ex);
  };
}
  
  render() {
    var ingredientsCounter = 0;
    var stepsCounter = 0;
    var ingredients = null;
    var steps = null;

    var rating_text = "no reviews"
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
                    <span className="based-span"><span className="accent-text">{isNaN(this.state.mark / this.state.totalMarks)? 0 : (this.state.mark / this.state.totalMarks).toFixed(1)}</span>({rating_text})</span>
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
                <p onClick={() => this.redirect(this.state.recipe.user.username)}>{this.state.recipe.user.username}</p>
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
                    <p className="accent-text">Your Review: </p>
                    <div className="userRatingStart">
                    {elements.map((value, index) => {
                      return value <= this.state.userMark ? <span key={index} onClick={() => this.rate(index + 1)}>★</span> :
                       <span key={index} onClick={() => this.rate(index + 1)}>☆</span>
                    })}
                    </div>
              </div>
            <div className="comments">
            {this.state.comments.filter(x => x.user).map((item, index) => {
                      return <div className={this.user.info.unique_name == item.user.username ? "commentBubble commentBubbleUser" : "commentBubble"} key={"comment" + index}>
                      <div className="commentCreator">
                      <div className="justFlex">
                        {
                          item.user.photo ?
                              <img src={item.user.photo} alt=""/> :
                              <div className="comment-photo">{item.user.username[0].toUpperCase()}</div>
                        }
                        <p onClick={() => this.redirect(item.user.username)}>{item.user.username}</p>
                      </div>
                      <img alt="" onClick={() => this.removeComment(item.id)}
                       src={require('../style/content/Images/Icons/cancel-outlined.png')} className="removeComment"/>
                      </div>
                      <p>{item.value}</p>
                      </div>
                    })
                    }
                  
            </div>
            <div className="commentSectionFooter">
              <input autoComplete="off" id="comment" placeholder="Type your comment here"  onKeyPress={this.handleKeyPress}/>
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
