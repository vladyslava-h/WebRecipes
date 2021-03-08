import React from 'react'
import Loader from './Loader';
import RecipePromo from './RecipePromo';
import '../style/index-recipes.css';
import '../style/index-home.css';
import '../style/profile.css';
import '../style/create.css';
import NoContentFound from './NoContentFound';
import Modal from 'react-bootstrap/Modal';

class Profile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoading: false,
            user: "",
            isSubscribed: false,
            disableBtn: false,
            subscribers: 0,
            isProfileOwner: false,
            isSubscribeBtnRunning: false,
            showModal: false,
            nameUpdate: "",
            emailUpdate: "",
            saveBtnDisabled: false,
            isUpdating: false,
            files: [],
            fileInternetUrl: "",
            photoUpdateUrl: "",
            fileName: "",
            pages: 0,
            current_page: 1,
            username: window.location.href.split('/').pop()
        }
        this.user = props.user;
        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
        this.getLikes = this.getLikes.bind(this);
        this.subscriptionInfo = this.subscriptionInfo.bind(this);
        this.refresh = this.refresh.bind(this);
        this.update = this.update.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.checkInputs = this.checkInputs.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.changePage = this.changePage.bind(this);
    }

    async componentWillReceiveProps(nextProps) {
        await this.setState({
            data: [],
            isLoading: false,
            user: "",
            isSubscribed: false,
            disableBtn: false,
            subscribers: 0,
            isProfileOwner: false,
            isSubscribeBtnRunning: false,
            username: window.location.href.split('/').pop()
        })
        this.refresh();
    }

    async componentDidMount() {
        this.refresh();
    }

    async refresh() {
        this.setState({
            isLoading: true
        })
        this.url = `http://localhost:5000/api/user/${this.state.username}/info?page=`+this.state.current_page;
        try {
            var response = await fetch(this.url);
            var fetcheddata = await response.json();
            let recipes = fetcheddata.data.recipes;
            this.setState({
                user: fetcheddata.data,
                nameUpdate: fetcheddata.data.name,
                emailUpdate: fetcheddata.data.email,
                photoUpdateUrl: fetcheddata.data.photo,
                passwordUpdate: fetcheddata.data.password,
                data: await this.getLikes(recipes),
                isLoading: false,
                pages: fetcheddata.pages,
                subscribers: fetcheddata.data.subscribers
            })
            this.getLikes();
            this.subscriptionInfo();
        }
        catch{
            this.setState({
                user: undefined,
                isLoading: false
            })
        }
    }

    async getLikes(recipes) {
        var response = await fetch(`http://localhost:5000/api/user/${this.user.info.unique_name}/favourites`);
        var fetcheddata = await response.json();
        let likedRecipes = [];
        try {
            likedRecipes = [...likedRecipes, ...fetcheddata.data];
            let likedIds = likedRecipes.map(recipe => recipe.id);
            recipes.forEach(recipe => {
                if (likedIds.includes(recipe.id)) {
                    recipe.isLiked = true;
                }
            });
            return recipes;
        }
        catch{

        }
    }

    subscribe() {
        let url = `http://localhost:5000/api/user/${this.user.info.unique_name}/subscribe?creator=${this.state.username}`;

        this.setState({
            isSubscribeBtnRunning: true
        })

        try {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${this.user.token}`
                }
            }).then(x => {
                this.setState({
                    isSubscribed: true,
                    subscribers: this.state.subscribers + 1,
                    isSubscribeBtnRunning: false
                });
            })
        }
        catch {

        };
    }

    unsubscribe() {
        let url = `http://localhost:5000/api/user/${this.user.info.unique_name}/unsubscribe?creator=${this.state.username}`;

        this.setState({
            isSubscribeBtnRunning: true
        })

        try {
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `bearer ${this.user.token}`,
                }
            }).then(x => {
                this.setState({
                    isSubscribed: false,
                    subscribers: this.state.subscribers - 1,
                    isSubscribeBtnRunning: false
                });
            })
        }
        catch {

        };
    }

    async subscriptionInfo() {
        if (this.user.info.unique_name === this.state.username) {
            this.setState({
                isProfileOwner: true
            })
        }
        var response = await fetch(`http://localhost:5000/api/user/${this.user.info.unique_name}/subscriptions`);
        var fetcheddata = await response.json();
        try {
            if (fetcheddata.data.includes(this.state.username)) {
                this.setState({
                    isSubscribed: true
                })
            }
        }
        catch{
        }
    }

    async handleChange(event) {
        const { name, value, files, type } = event.target;
        if (type === "file") {
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
            await this.checkInputs();
            if (name === "fileInternetUrl") {
                this.setState({
                    fileName: "",
                    files: []
                });
            }
        }
    }

    async checkInputs() {
        if (this.state.nameUpdate === ""
            || this.state.emailUpdate === "") {
            await this.setState({
                saveBtnDisabled: true
            })
        }
        else {
            await this.setState({
                saveBtnDisabled: false
            })
        }
    }

    async update() {
        await this.checkInputs();
        this.setState({
            saveBtnDisabled: true,
            isUpdating: true
        })

        let urlUpdate = "http://localhost:5000/api/user/update/" + this.state.user.id;

        await this.uploadImage();

        let credentials = {
            'name': this.state.nameUpdate,
            'email': this.state.emailUpdate,
            'photo': this.state.photoUpdateUrl
        };

        fetch(urlUpdate, {
            method: 'PUT',
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${this.user.token}`
            }
        }).then(response => {
            if (response.ok) {
                this.setState({
                    showModal: false,
                    user: {
                        id: this.state.user.id,
                        name: this.state.nameUpdate,
                        email: this.state.emailUpdate,
                        username: this.state.user.username,
                        recipesCount: this.state.user.recipesCount,
                        subscribers: this.state.user.subscribers,
                        photo: this.state.photoUpdateUrl ?? null
                    },
                    saveBtnDisabled: false,
                    isUpdating: false
                })

            }
        }).catch(e => {
        });
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
                    photoUpdateUrl: file.secure_url
                })
            }
            catch{ }
        }
        else if (this.state.fileInternetUrl !== "") {
            this.setState({
                photoUpdateUrl: this.state.fileInternetUrl
            })
        }
    }

    async changePage(index){
        await this.setState({
            current_page: index
        })
        this.refresh();
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
                this.state.user === undefined ? <NoContentFound message="404" /> :
                    <div id="profileData">
                        <div id="profileHeader" className={this.state.user.photo === null ? "" : "backimageMinimal"}>
                            <div className="imageOverlay"></div>
                            {
                                this.state.user.photo !== null ?
                                    <img alt="user" src={this.state.user.photo} id="profileImg" /> :
                                    <p id="profileImg">{this.state.user.username.charAt(0).toUpperCase()}</p>
                            }
                            <p id="profileName">{this.state.user.name?.toUpperCase()}</p>
                            <p id="profileUsername">{this.state.user.username?.toLowerCase()}</p>
                            <hr />
                            <div id="profileFollowersRecipesNum">
                                <div className="totalRecipes">
                                    <p className="number">{this.state.user.recipesCount}</p>
                                    <p>Recipes</p>
                                </div>
                                <div className="totalSubs">
                                    <p className="number">{this.state.subscribers}</p>
                                    <p>Subscribers</p>
                                </div>
                            </div>
                            {this.state.isProfileOwner ?
                                <button className="followBtn followingBtnState"
                                    onClick={() => this.setState({ showModal: true })}>Edit Profile</button>
                                :
                                this.state.isSubscribed ?
                                    <button className="followBtn followingBtnState"
                                        disabled={this.state.isSubscribeBtnRunning}
                                        onClick={() => this.unsubscribe()}>Unsubscribe</button> :
                                    <button className="followBtn followBtnState"
                                        disabled={this.state.isSubscribeBtnRunning}
                                        onClick={() => this.subscribe()}>Subscribe</button>
                            }
                        </div>
                        {
                            //loading user's recipes
                            this.state.data.length !== 0 ?
                                <div>
                                    <h1 className="accent-text">Recipes</h1>
                                    <div id="usersRecipesList" className="recipesSection">
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

                                </div> 
                                :
                                <div></div>
                        }
                        <Modal show={this.state.showModal}
                            backdrop="static"
                            onHide={() => this.setState({ showModal: false })}
                            keyboard={false}>
                            {
                                this.state.isUpdating ?
                                    <Modal.Header>
                                        <Modal.Title>Edit Profile</Modal.Title>
                                    </Modal.Header> :
                                    <Modal.Header closeButton>
                                        <Modal.Title>Edit Profile</Modal.Title>
                                    </Modal.Header>
                            }

                            <Modal.Body>
                                {
                                    this.state.isUpdating ? <div className="updating"><Loader /></div> :
                                        <div>
                                            <div className="form-group">
                                                <input autocomplete="off" type="text" className="form-control"
                                                    id="nameFormReg" aria-describedby="emailHelp"
                                                    name="nameUpdate"
                                                    value={this.state.nameUpdate}
                                                    onChange={this.handleChange}
                                                    placeholder="Name" />
                                            </div>
                                            <div className="form-group">
                                                <input type="email" className="form-control"
                                                    id="loginFormReg" aria-describedby="emailHelp"
                                                    name="emailUpdate"
                                                    value={this.state.emailUpdate}
                                                    onChange={this.handleChange}
                                                    placeholder="Email" />
                                            </div>

                                            <div className="profileUpdateImg">
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
                                                            <input autocomplete="off" type="text" className="form-control"
                                                                value={this.state.fileInternetUrl}
                                                                name="fileInternetUrl"
                                                                onChange={this.handleChange}
                                                                placeholder="http://..." />
                                                        </div>
                                                    </div>

                                                    <p className="fileName"
                                                        name="fileName"
                                                        onChange={this.handleChange}
                                                    >{this.state.fileName}</p>
                                                </div>

                                            </div>
                                        </div>
                                }

                            </Modal.Body>

                            <Modal.Footer>
                                <button className="btn btn-secondary"
                                    disabled={this.state.saveBtnDisabled}
                                    onClick={this.update}>Save</button>
                            </Modal.Footer>
                        </Modal>
                    </div >
        )
    }
}

export default Profile;