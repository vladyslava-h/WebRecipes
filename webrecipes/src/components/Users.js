import React from 'react'
import Loader from './Loader';
import NoContentFound from './NoContentFound';
import '../style/index-home.css';
import '../style/users.css';
import Table from 'react-bootstrap/Table';
import { DropdownButton, DropdownItem } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

class Users extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoading: false,
            showModal: false,
            selectedUser: null
        }
        this.user = props.user;
        this.redirect = this.redirect.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.loadInfo = this.loadInfo.bind(this);
    }

    async componentDidMount() {
        await this.loadInfo();
    }

    async loadInfo() {
        this.setState({
            isLoading: true
        })
        let url = "http://localhost:5000/api/users/statistic";
        try {
            var response = await fetch(url);
            var fetcheddata = await response.json();
            this.setState({
                data: fetcheddata.data,
                isLoading: false
            })
        }
        catch{

        }
    }

    redirect(username) {
        this.props.history.push(`/profile/${username}`)
    }

    updateUser(user, role) {
        if (user.role !== role) {
            let urlUpdate = "http://localhost:5000/api/user/update/" + user.id;
            this.setState({
                // isLoading: true,
                selectedUser: user
            });

            let credentials = {
                'name': user.name,
                'password': user.password,
                'role': role,
                'email': user.email
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
                        data: this.state.data.map(item => {
                            if (item.id === user.id) {
                                item.role = role;
                            }
                            return item;
                        })
                    })

                }
            }).catch(e => {

            });
        }
    }

    deleteUser(id) {
        this.setState({
            isLoading: true,
            showModal: false
        })
        try {
            let url = "http://localhost:5000/api/users/remove?id=" + id;
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `bearer ${this.user.token}`
                }
            }).then(x => {
                this.loadInfo();
            });
        }
        catch {
        };
    }

    render() {
        let index = 1;
        return (
            this.user.info.role !== "Admin" ? <NoContentFound message="404" /> :
                this.state.isLoading ? <Loader /> :
                    this.state.data.length !== 0 ?
                        <div id="users">
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th className="subs">Subscribers</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.data.map(user =>
                                            <tr key={`user${user.id}`}>
                                                <td>{index++}</td>
                                                <td id="maininfo">
                                                    <div className="followingPhoto" onClick={() => this.redirect(user.username)}>
                                                        {
                                                            user.photo !== null ?
                                                                <img alt="user" src={user.photo} id="profileImg" /> :
                                                                <p>{user.username.charAt(0).toUpperCase()}</p>
                                                        }
                                                    </div>
                                                    <div>
                                                        <p className="name" onClick={() => this.redirect(user.username)}> {user.name} <span>{"(" + user.username + ")"}</span></p>
                                                        <p className="email">{user.email}</p>
                                                    </div>
                                                </td>
                                                <td className="subs">{user.subscribers}</td>
                                                <td>
                                                    <div>
                                                        <DropdownButton id="dropdown-basic-button" title={user.role}
                                                            disabled={user.username === "masterchef" || user.username === this.user.info.unique_name}>
                                                            <DropdownItem onClick={() => this.updateUser(user, "Admin")}>Admin</DropdownItem>
                                                            <DropdownItem onClick={() => this.updateUser(user, "User")}>User</DropdownItem>
                                                        </DropdownButton>
                                                    </div>
                                                </td>
                                                <td>
                                                    {
                                                        user.username === "masterchef" || user.username === this.user.info.unique_name ?
                                                            <div className="locked">
                                                                <div className="btn-lock">
                                                                    <img src={require('../style/content/Images/Icons/lock.png')} alt="delete" id="delete_icon" />
                                                                </div>
                                                            </div> :
                                                            <button className="btn btn-danger"
                                                                onClick={() => this.setState({ showModal: true, selectedUser: user })}>
                                                                <img src={require('../style/content/Images/Icons/trash.png')} alt="delete" id="delete_icon" />
                                                            </button>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </Table>
                            <Modal show={this.state.showModal}
                                backdrop="static"
                                onHide={() => this.setState({ showModal: false })}
                                keyboard={false}>
                                <Modal.Header closeButton>
                                    <Modal.Title>You are about to delete the user: <b>{this.state.selectedUser?.username}</b></Modal.Title>
                                </Modal.Header>

                                <Modal.Body>
                                    <p>All associated data will also be deleted!<br></br>
                                        <b>Are you sure?</b> <span style={{ color: "red", fontWeight: "500" }}>There is no undo!</span>
                                    </p>
                                </Modal.Body>

                                <Modal.Footer>
                                    <button className="btn btn-secondary"
                                        onClick={() => this.setState({ showModal: false })}>No, keep the user</button>
                                    <button className="btn btn-danger"
                                        onClick={() => this.deleteUser(this.state.selectedUser?.id)}>Yes, delete this user</button>
                                </Modal.Footer>
                            </Modal>
                        </div > :

                        <NoContentFound
                            message="Hmmm.. Seems like there\'s still no users :("
                            isRecipesPage={false} />
        )
    }
}

export default withRouter(Users);