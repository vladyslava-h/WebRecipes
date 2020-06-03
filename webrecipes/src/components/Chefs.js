import React from 'react'
import Loader from './Loader';
import NoContentFound from './NoContentFound';
import '../style/index-recipes.css';
import '../style/index-home.css';
import '../style/index-subscriptions.css';
import Subscription from './Subscription';
import { withRouter } from 'react-router-dom';

import { Modal } from 'react-bootstrap';

class Chefs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoading: false,
            showModal: true
        }
        this.url = props.url;
        this.user = props.user;
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    handleClose() {
        this.setState({
            showModal: false
        })
        this.props.history.goBack();
    }

    handleShow() {
        this.setState({
            showModal: true
        })
    }

    async componentDidMount() {
        this.setState({
            isLoading: true
        })
        var response = await fetch(this.url);
        var fetcheddata = await response.json();
        try {
            this.setState({
                data: [...this.state.data, ...fetcheddata.data],
                isLoading: false
            })
        }
        catch{
        }
    }

    render() {
        let index = 1;
        return (
            this.state.isLoading ? <Loader /> :
                this.state.data.length !== 0 ?
                    <div id="noContentFound">
                        <img src={require('../style/content/Images/Icons/chef_transparent.png')} alt="" />
                        <Modal show={this.state.showModal} onHide={this.handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    <h5 className="modal-title" id="followingModelTitle">Following Chefs</h5>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {
                                    this.state.data.map(item =>
                                        <Subscription item={item} user={this.user} key={index++} />
                                    )}
                            </Modal.Body>
                        </Modal>
                    </div>
                    :
                    <NoContentFound messageHeader="You are not following anyone yet"
                        message=""
                        isRecipesPage={false} />
        )
    }
}

export default withRouter(Chefs);