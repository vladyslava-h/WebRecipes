import React from 'react'
import Loader from './Loader';
import NoContentFound from './NoContentFound';
import EditRecipe from './EditRecipe';
import '../style/index-recipes.css';
import '../style/index-home.css';
import '../style/recipe-edit.css';
import { withRouter } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

class Recipes extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoading: false,
            showModal: false,
            selectedRecipe: null,
            showCloseBtn: true,
            showModalDelete: false,
            current_page: 1,
            pages: 0
        }
        this.url = props.url;
        this.user = props.user;
        this.redirect = this.redirect.bind(this);
        this.delete = this.delete.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.callbackFunction = this.callbackFunction.bind(this);
        this.loadInfo = this.loadInfo.bind(this);
        this.redirectToRecipe = this.redirectToRecipe.bind(this);
        this.changePage = this.changePage.bind(this);
    }


    async componentDidMount() {
        await this.loadInfo();
    }

    async loadInfo() {
        this.setState({
            isLoading: true
        })

        var response = await fetch(this.url + "?page=" + this.state.current_page);
        var fetcheddata = await response.json();
        try {
            this.setState({
                data: fetcheddata.data,
                pages: fetcheddata.pages,
                isLoading: false,
                showModal: false,
                showCloseBtn: true
            })
        }
        catch{

        }
    }

    handleClose(modal) {
        if (modal === "main") {
            this.setState({
                showModal: false
            })
        }
        else if (modal === "delete") {
            this.setState({
                showModalDelete: false,
                showModal: true
            })
        }
    }

    handleShow() {
        this.setState({
            showModal: true
        })
    }

    async delete() {
        this.setState({
            isLoading: true,
            showModalDelete: false
        })
        try {
            let url = "http://localhost:5000/api/user/" + this.user.info.unique_name + "/recipe?id=" + this.state.selectedRecipe.id;
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `bearer ${this.token}`
                }
            }).then(x => {
                this.setState({ showCloseBtn: true, showModal: false, isLoading: true });
                this.loadInfo();
            });
        }
        catch {
        };
    }

    async callbackFunction(childData) {
        childData === "updating" ?
            await this.setState({ showCloseBtn: false }) :
            childData === "error" ?
                await this.setState({ showCloseBtn: true }) :
                childData === "delete" ?
                    await this.setState({ showModal: false, showModalDelete: true }) :
                    await this.loadInfo();
    }

    redirect(item) {
        this.props.history.push(`/profile/${item.user.username}`)
    }

    redirectToRecipe(id){
        this.props.history.push(`/recipe/${id}`)
    }

    async changePage(index){
        await this.setState({
            current_page: index
        })
        this.loadInfo();
    }

    render() {
        const elements = [1, 2, 3, 4, 5];
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
                        <div id="edit-recipe">
                            <Modal show={this.state.showModalDelete}
                                backdrop="static"
                                onHide={() => this.handleClose("delete")}
                                keyboard={false}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Are you sure?</Modal.Title>
                                </Modal.Header>

                                <Modal.Body>
                                    <p>You will not be able to recover '{this.state.selectedRecipe?.name}'</p>
                                </Modal.Body>

                                <Modal.Footer>
                                    <button className="btn btn-secondary"
                                        onClick={() => this.handleClose("delete")}>Cancel</button>
                                    <button className="btn btn-danger"
                                        onClick={this.delete}>Yes, delete it!</button>
                                </Modal.Footer>
                            </Modal>
                            <Modal show={this.state.showModal}
                                backdrop="static"
                                keyboard={false}
                                onHide={() => this.handleClose("main")}
                                size="lg"
                                dialogClassName="modal-90w"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered>
                                {
                                    this.state.showCloseBtn ?
                                        <Modal.Header closeButton>
                                        </Modal.Header> :
                                        <Modal.Header>
                                        </Modal.Header>
                                }
                                <Modal.Body dialogClassName="edit-modal">
                                    <EditRecipe parentCallback={this.callbackFunction}
                                        recipe={this.state.selectedRecipe}
                                        user={this.user} />
                                </Modal.Body>
                            </Modal>
                        </div>
                        {
                            this.state.data.map(item =>
                                <div className="recipeBlock" data-id={item.id} key={item.id}>
                                    <img className="recipeImg" onClick={() => this.redirectToRecipe(item.id)}
                                        src={item.photo === "" ?
                                            require('../style/content/Images/default-recipe.png')
                                            : item.photo} alt="recipe" />
                                    <div className="recipeCircleBtn">
                                        <div className="under"></div>
                                        <div className="recipeRemoveBlock"
                                            onClick={() => this.setState({ showModal: true, selectedRecipe: item, showCloseBtn: true })}
                                            data-id={item.id}></div>
                                    </div>
                                    <div className={`recipeTimeBlock recipeTimeBlock${item.levelId}`}>
                                        <p><span className="recipeTime">{item.time}</span>&nbsp;Minutes</p>
                                    </div>
                                    <p className="recipeName" onClick={() => this.redirectToRecipe(item.id)}>{
                                        item.name.length > 44 ? item.name.substr(0, 40) + '...' : item.name
                                    }</p>
                                    <p className="recipeCreator" onClick={() => this.redirect(item)}>By:&nbsp;<span>{item.user.username}</span></p>
                                    <div className="rating">
                                        {elements.map((value, index) => {
                                            return value <= item.mark ? <span key={index}>★</span> : <span key={index}>☆</span>
                                        })}
                                    </div>
                                </div>
                            )
                            }
                             </div>
                            {
                                this.state.pages !== 0 ? 
                                <div className="pagesSection">
                                    {
                                        pages.map(x =>
                                            <div onClick={() => this.changePage(x)} key={x + "-paginationBtn"}
                                            className={this.state.current_page === x ?  "paginationBtn active" : "paginationBtn"} id={x+"-paginationBtn"}>
                                                {x}
                                            </div>)
                                    }
                                </div>  : <div></div>
                            } </div>
                             :

                    <NoContentFound messageHeader="You haven’t uploaded any recipes yet"
                        message=""
                        isRecipesPage={true} />
        )
    }
}

export default withRouter(Recipes);