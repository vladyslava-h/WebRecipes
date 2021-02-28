import React from "react";
import Loader from "./Loader";
import NoContentFound from './NoContentFound';

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
    this.url = `http://localhost:5000/api/recipes/getrecipe/${this.state.recipeId}`;
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
    return this.state.isLoading ? <Loader /> :
    this.state.recipe === undefined ? <NoContentFound message="404" /> :
    <div>
        <h1>{this.state.recipe.name}</h1>
    </div>;
  }
}

export default Recipe;
