import React from 'react';
import '../style/create.css';
import Loader from './Loader';

class CreateRecipe extends React.Component {
    constructor(props) {
        super(props)

        this.user = props.user;

        this.state = {
            name: "",
            isLoading: true,
            buttonActionClass: "",
            pageIndex: 1,
            isPrevVisible: false,
            nextBtnText: "Next",
            progress: 10,
            minutes: "",
            selectedLevel: "",
            levels: [],
            selectedMeal: "",
            meals: [],
            imageUrl: "",
            fileName: "",
            newIngredient: "",
            ingredients: ["lemon", "onion"]
        }

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.save = this.save.bind(this);
        this.getLevelsAndMeals = this.getLevelsAndMeals.bind(this);
        this.removeRecipe = this.removeRecipe.bind(this);
    }

    next() {
        if (this.state.pageIndex === 3) {
            this.save();
        }
        else {
            this.setState(state => ({
                buttonActionClass: "goToIngredients",
                pageIndex: state.pageIndex++,
                isPrevVisible: true,
                nextBtnText: state.pageIndex === 4 ? "Save" : "Next",
                progress: state.progress + 45
            }))
        }
    }

    prev() {
        if (this.state.pageIndex === 2) {
            this.setState(state => ({
                isPrevVisible: false
            }))
        }
        this.setState(state => ({
            buttonActionClass: "goToDirections",
            pageIndex: state.pageIndex--,
            nextBtnText: "Next",
            progress: state.progress - 45
        }))
    }

    save() {

    }

    handleChange(event) {
        const { name, value, type } = event.target;
        if (type === "radio" && name === "radio-group-level") {
            this.setState({
                selectedLevel: value
            });

        }
        else if (type === "radio" && name === "radio-group-meal") {
            this.setState({
                selectedMeal: value
            });
        }
        else {
            this.setState({
                [name]: value
            });
        }

    }

    async componentDidMount() {
        this.getLevelsAndMeals();
    }

    async getLevelsAndMeals() {
        this.setState({
            isLoading: true
        })
        var response = await fetch("http://localhost:5000/api/levels");
        var fetcheddata = await response.json();

        var responseMeals = await fetch("http://localhost:5000/api/meals");
        var fetcheddataMeals = await responseMeals.json();
        try {
            this.setState({
                levels: [...this.state.levels, ...fetcheddata.data],
                meals: [...this.state.meals, ...fetcheddataMeals.data],
                isLoading: false,
                selectedLevel: "level" + fetcheddata.data[0].id,
                selectedMeal: "meal" + fetcheddataMeals.data[0].id
            })
        }
        catch{
        }
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.state.ingredients.push(this.state.newIngredient);
            this.setState({
                newIngredient: "",
            })
        }
    }

    removeRecipe(value) {
        let removed = false;
        this.setState({
            ingredients: this.state.ingredients.filter(function (item) {
                if (item !== value) {
                    return true;
                }
                else {
                    if (removed === true) {
                        return true;
                    }
                    removed = true;
                    return false;
                }
            })
        })
    }

    render() {
        let index = 0;
        return (
            this.state.isLoading ? <Loader /> :
                <div className="createPage">
                    <div id="createProgress">
                        <div id="createBar"
                            style={{ width: `${this.state.progress}%` }}
                        >{this.state.progress}%</div>
                    </div>
                    <h1 className="title">Create Your Recipe</h1>
                    <div id="main">
                        {/* TODO: basic */}
                        <div className={`content page${this.state.pageIndex}`} id="basic">
                            <h3 className="pageTitle">Basic Information</h3>
                            <div className="form-group">
                                <input type="text" className="form-control"
                                    value={this.state.name}
                                    name="name"
                                    onChange={this.handleChange}
                                    placeholder="Name" />
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control"
                                    value={this.state.minutes}
                                    name="minutes"
                                    onChange={this.handleChange}
                                    placeholder="Minutes" />
                            </div>
                            <div className="level">
                                <p className="title">Recipe Level</p>
                                <div className="levelRadio">
                                    {
                                        this.state.levels.map(item =>
                                            <p key={`${item.id}`} id={`level${item.id}p`}>
                                                <input type="radio" id={`level${item.id}`} name="radio-group-level" value={`level${item.id}`}
                                                    checked={this.state.selectedLevel === `level${item.id}`}
                                                    onChange={this.handleChange} />
                                                <label htmlFor={`level${item.id}`}>{item.name}</label>
                                            </p>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="meals">
                                <p className="title">Meal</p>
                                <div className="mealRadio">
                                    {
                                        this.state.meals.map(item =>
                                            <p key={`${item.id}`} id={`meal`}>
                                                <input type="radio" id={`meal${item.id}`} name="radio-group-meal" value={`meal${item.id}`}
                                                    checked={this.state.selectedMeal === `meal${item.id}`}
                                                    onChange={this.handleChange} />
                                                <label htmlFor={`meal${item.id}`}>{item.name}</label>
                                            </p>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="photoUploadSection">
                                <p className="title">Upload Image</p>
                                <p className="sub-title">(upload file from your computer or insert link to online image)</p>
                                <div className="uploadImageSource">
                                    <button className="selectFileBtn btn">
                                        <img src={require('../style/content/Images/Icons/upload.png')} alt="" id="selectFile_icon" />
                                        Select file</button>
                                    <div className="form-group">
                                        <input type="text" className="form-control"
                                            value={this.state.imageUrl}
                                            name="imageUrl"
                                            onChange={this.handleChange}
                                            placeholder="http://..." />
                                    </div>
                                    <p className="fileName">{this.state.fileName}</p>
                                </div>

                            </div>
                        </div>

                        {/* TODO: ing */}
                        <div className="content" id="ingredients">
                            <h3 className="pageTitle">Ingredients</h3>
                            <div id="addIngredientSection">
                                <fieldset className="form-group">
                                    <input type="text" className="form-control newIngredientInput"
                                        value={this.state.newIngredient}
                                        name="newIngredient"
                                        onChange={this.handleChange}
                                        onKeyPress={this.handleKeyPress}
                                        id="newIngredient" />
                                    <label htmlFor="newIngredient">Ingredient and its amount</label>
                                </fieldset>
                            </div>
                            <div id="ingredientsSection">
                                {
                                    this.state.ingredients.map((item =>
                                        <div key={`${index++}`} className="ingredient">
                                            <p>{item}</p>
                                            <button className="btn"
                                                onClick={() => this.removeRecipe(item)}
                                            >Delete</button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        {/* TODO: dir */}
                        <div className="content" id="directions">
                            <h3 className="pageTitle">Directions</h3>
                        </div>
                    </div>

                    <div className="navigation">
                        <button onClick={() => this.prev()}
                            className="btn btnPrev"
                            style={this.state.isPrevVisible ? {} : { display: 'none' }}>Prev</button>
                        <button onClick={() => this.next()}
                            className="btn btnNext"
                        >{this.state.nextBtnText}</button>
                    </div>
                </div>
        )
    }
}

export default CreateRecipe;