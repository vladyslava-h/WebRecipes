import React from 'react';
import '../style/create.css';
import Loader from './Loader';
import { withRouter } from 'react-router-dom';

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
            isNextBtnDisabled: false,
            nextBtnText: "Next",
            progress: 10,
            minutes: "",
            selectedLevel: "",
            levels: [],
            selectedMeal: "",
            meals: [],
            fileName: "",
            newIngredient: "",
            ingredients: [],
            newDirection: "",
            directions: [],
            fileUrl: "",
            fileInternetUrl: "",
            files: null,
            message: ""
        }

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleKeyPressDir = this.handleKeyPressDir.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.checkInputs = this.checkInputs.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.save = this.save.bind(this);
        this.getLevelsAndMeals = this.getLevelsAndMeals.bind(this);
        this.removeIngredient = this.removeIngredient.bind(this);
        this.removeDirection = this.removeDirection.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }

    next() {
        if (this.state.pageIndex === 3) {
            this.checkInputs();
            if (!this.state.isNextBtnDisabled) {
                this.save();
            }
        }
        else {
            this.setState(state => ({
                buttonActionClass: "goToIngredients",
                pageIndex: state.pageIndex++,
                isPrevVisible: true,
                nextBtnText: state.pageIndex === 4 ? "Save" : "Next",
                progress: state.progress + 45
            }))
            if (this.state.pageIndex === 2) {
                this.checkInputs();
            }
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
            progress: state.progress - 45,
            isNextBtnDisabled: false
        }))
    }

    async save() {
        await this.uploadImage();

        let urlCreate = 'http://localhost:5000/api/recipes/create';
        this.setState({
            isLoading: true,
            message: ""
        });

        let credentials = {
            'mealId': this.state.selectedMeal.replace('meal', ''),
            'levelId': this.state.selectedLevel.replace('level', ''),
            'name': this.state.name,
            'username': this.user.info.unique_name,
            'ingredients': this.state.ingredients.join('\n'),
            'directions': this.state.directions.join('\n'),
            'time': this.state.minutes,
            'photo': this.state.fileUrl
        };

        fetch(urlCreate, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${this.user.token}`
            }
        }).then(response => {
            if (!response.ok) {
                response.json().then(txt => this.setState({
                    message: "Can't save this recipe :("
                }));
            } else {
                this.props.history.push("/recipes");
            }
        })
            .catch(e => {
                this.setState({
                    message: "Can't save this recipe :("
                })
            });;
    }

    handleChange(event) {
        const { name, value, type, files } = event.target;
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
        else if (type === "file") {
            try {
                this.setState({
                    files: files,
                    fileName: files[0].name,
                    fileInternetUrl: ""
                })
            }
            catch { }

        }
        else {
            this.setState({
                [name]: value
            });
            if (name === "fileInternetUrl") {
                this.setState({
                    fileName: "",
                    files: []
                });
            }
        }
    }

    async uploadImage() {
        if (this.state.fileInternetUrl === "" && this.state.files?.length !== 0) {
            let files = this.state.files;
            try {
                let data = new FormData();
                data.append('file', files[0]);
                data.append('upload_preset', 'pxswbvyr');
                const res = await fetch(
                    'https://api.cloudinary.com/v1_1/dd6b2ufgk/image/upload',
                    {
                        method: 'POST',
                        body: data
                    }
                )
                const file = await res.json();
                this.setState({
                    fileUrl: file.secure_url
                })
            }
            catch{ }
        }
        else {
            this.setState({
                fileUrl: this.state.fileInternetUrl
            })
        }
    }

    checkInputs() {
        if (this.state.name !== "" && this.state.minutes !== ""
            && !isNaN(this.state.minutes) && !this.state.minutes.includes(" ")
            && this.state.ingredients.length > 0
            && this.state.directions.length > 0) {
            this.setState({
                isNextBtnDisabled: false
            });
        }
        else {
            this.setState({
                isNextBtnDisabled: true
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

    handleKeyPressDir = (event) => {
        if (event.key === 'Enter') {
            this.state.directions.push(this.state.newDirection);
            this.setState({
                newDirection: "",
                isNextBtnDisabled: false
            })
            this.checkInputs();
        }
    }

    removeDirection(value) {
        let removed = false;
        this.setState({
            directions: this.state.directions.filter(function (item) {
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
            }),
            isNextBtnDisabled: this.state.directions.length === 1 ? true : false
        })
    }

    removeIngredient(value) {
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
        let indexDir = 0;
        return (
            this.state.isLoading ?
                <div>
                    <Loader />
                    <p className="message">{this.state.message}</p>
                </div> :
                <div className="createPage">
                    <div id="createProgress">
                        <div id="createBar"
                            style={{ width: `${this.state.progress}%` }}
                        >{this.state.progress}%</div>
                    </div>
                    <h1 className="title accent-text">Create Your Recipe</h1>
                    <div id="main">
                        <div className={`content page${this.state.pageIndex}`} id="basic">
                            <h3 className="pageTitle">Basic Information</h3>
                            <fieldset className="form-group">
                                <input type="text" className="form-control"
                                    value={this.state.name}
                                    name="name"
                                    onChange={this.handleChange}
                                    id="name" />
                                <label htmlFor="name"
                                    className={this.state.name === "" ? "" : "smallLabel"}>Name
                                    <span className="important">*</span></label>
                            </fieldset>
                            <fieldset className="form-group minutes">
                                <input type="text" className="form-control"
                                    value={this.state.minutes}
                                    name="minutes"
                                    onChange={this.handleChange}
                                    id="minutes" />
                                <label htmlFor="minutes"
                                    className={this.state.minutes === "" ? "" : "smallLabel"}>Minutes
                                    <span className="important">*</span></label>
                            </fieldset>
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
                                    <label className="selectFileBtn btn" htmlFor="file">
                                        <img src={require('../style/content/Images/Icons/upload.png')} alt="" id="selectFile_icon" />
                                        <input type="file" className="form-control"
                                            onChange={this.handleChange}
                                            name="files"
                                            id="file" />
                                        Select file
                                        </label>

                                    <div className="form-group">
                                        <input type="text" className="form-control"
                                            value={this.state.fileInternetUrl}
                                            name="fileInternetUrl"
                                            onChange={this.handleChange}
                                            placeholder="http://..." />
                                    </div>

                                    <p className="fileName"
                                        name="fileName"
                                        onChange={this.handleChange}
                                    >{this.state.fileName}</p>
                                </div>

                            </div>
                        </div>

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
                                    <label htmlFor="newIngredient">Ingredient and its amount
                                    <span className="important">*</span></label>
                                </fieldset>
                            </div>
                            <div id="ingredientsSection">
                                {
                                    this.state.ingredients.map((item =>
                                        <div key={`${index++}`} className="ingredient">
                                            <p>{item}</p>
                                            <button className="btn"
                                                onClick={() => this.removeIngredient(item)}
                                            >Delete</button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="content" id="directions">
                            <h3 className="pageTitle">Directions</h3>
                            <div id="addDirectionSection">
                                <fieldset className="form-group">
                                    <input type="text" className="form-control newIngredientInput"
                                        value={this.state.newDirection}
                                        name="newDirection"
                                        onChange={this.handleChange}
                                        onKeyPress={this.handleKeyPressDir}
                                        id="newDirection" />
                                    <label htmlFor="newDirection">Step-by-step instruction
                                    <span className="important">*</span></label>
                                </fieldset>
                            </div>
                            <div id="directionsSection">
                                {
                                    this.state.directions.map((item =>
                                        <div key={`${indexDir++}`} className="ingredient">
                                            <p>{item}</p>
                                            <button className="btn"
                                                onClick={() => this.removeDirection(item)}
                                            >Delete</button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    <div className="navigation">
                        <button onClick={() => this.prev()}
                            className="btn btnPrev"
                            style={this.state.isPrevVisible ? {} : { display: 'none' }}>Prev</button>
                        <button onClick={() => this.next()}
                            className={`btn btnNext`}
                            disabled={this.state.isNextBtnDisabled}
                        >{this.state.nextBtnText}</button>
                    </div>
                </div>
        )
    }
}

export default withRouter(CreateRecipe);