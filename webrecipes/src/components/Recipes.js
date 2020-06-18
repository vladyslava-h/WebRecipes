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
            showCloseBtn: true
        }
        this.url = props.url;
        this.user = props.user;
        this.redirect = this.redirect.bind(this);
        this.save = this.save.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.callbackFunction = this.callbackFunction.bind(this);
        this.loadInfo = this.loadInfo.bind(this);
    }


    async componentDidMount() {
        await this.loadInfo();
    }

    async loadInfo() {
        this.setState({
            isLoading: true
        })
        var response = await fetch(this.url);
        var fetcheddata = await response.json();
        try {
            this.setState({
                data: fetcheddata.data,
                isLoading: false,
                showModal: false,
                showCloseBtn: true
            })
        }
        catch{

        }
    }

    handleClose() {
        this.setState({
            showModal: false
        })
    }

    handleShow() {
        this.setState({
            showModal: true
        })
    }

    save() {

    }

    async callbackFunction(childData) {
        childData === "updating" ?
            await this.setState({ showCloseBtn: false }) :
            childData === "error" ?
                await this.setState({ showCloseBtn: true }) :
                await this.loadInfo();
    }

    redirect(item) {
        this.props.history.push(`/profile/${item.user.username}`)
    }

    render() {
        const elements = [1, 2, 3, 4, 5];
        return (
            this.state.isLoading ? <Loader /> :
                this.state.data.length !== 0 ?
                    <div id="recipesSection" className="recipesSection">
                        <div id="edit-recipe">
                            <Modal show={this.state.showModal}
                                backdrop="static"
                                keyboard={false}
                                onHide={this.handleClose}
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
                                    <img className="recipeImg"
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
                                    <p className="recipeName">{item.name}</p>
                                    <p className="recipeCreator" onClick={() => this.redirect(item)}>By:&nbsp;<span>{item.user.username}</span></p>
                                    <div className="rating">
                                        {elements.map((value, index) => {
                                            return value <= item.mark ? <span key={index}>★</span> : <span key={index}>☆</span>
                                        })}
                                    </div>
                                </div>
                            )} </div> :

                    <NoContentFound messageHeader="You haven’t uploaded any recipes yet"
                        message=""
                        isRecipesPage={true} />
        )
    }
}

export default withRouter(Recipes);