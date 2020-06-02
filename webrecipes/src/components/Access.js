import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/access.css';

class Access extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            buttonActionClass: "",
            usernameLogIn: "",
            passwordLogIn: "",
            errorMessage: "",
            isError: false,
            isErrorSignUp: false,
            isLoading: false,
            nameSignUp: "",
            usernameSignUp: "",
            emailSignUp: "",
            passwordSignUp: ""
        }

        this.goToSignUp = this.goToSignUp.bind(this);
        this.goToLogIn = this.goToLogIn.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.logIn = this.logIn.bind(this);
        this.signUp = this.signUp.bind(this);
    }

    goToSignUp() {
        this.setState(state => ({
            buttonActionClass: "goToSignUp"
        }))
    }

    goToLogIn() {
        this.setState(state => ({
            buttonActionClass: ""
        }))
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    logIn() {
        let credentials = {
            'email': this.state.usernameLogIn,
            'password': this.state.passwordLogIn
        };
        let url = 'http://localhost:5000/api/account/authenticate';
        this.setState({
            isLoading: true
        })
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                response.json().then(txt => this.setState({
                    errorMessage: txt.message,
                    isError: true,
                    isLoading: false
                }));
            } else {
                response.json()
                    .then(x => {
                        window.localStorage.setItem('webrecipesapicredentials', x.data.token);
                        window.location.reload(false);
                    });
                this.setState({
                    isLoading: false
                })
            }
        })
            .catch(e => {
                this.setState({
                    isError: true,
                    errorMessage: "Unknown Error has Occurred",
                    isLoading: false
                })

            });

    }

    signUp() {
        let urlReg = 'http://localhost:5000/api/account/registration';
        this.setState({
            isLoading: true
        });

        let regcredentials = {
            'name': this.state.nameSignUp,
            'username': this.state.usernameSignUp,
            'password': this.state.passwordSignUp,
            'email': this.state.emailSignUp
        };

        fetch(urlReg, {
            method: 'POST',
            body: JSON.stringify(regcredentials),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                response.json().then(txt => this.setState({
                    errorMessage: txt.message,
                    isErrorSignUp: true,
                    isLoading: false
                }));
            } else {
                response.json()
                    .then(x => {
                        try {
                            window.localStorage.removeItem('webrecipesapicredentials');
                        }
                        catch{ }
                        window.localStorage.setItem('webrecipesapicredentials', x.data.token);
                        window.location.reload(false);
                    });
            }
        })
            .catch(e => {
                this.setState({
                    isErrorSignUp: true,
                    errorMessage: "Unknown Error has Occurred",
                    isLoading: false
                })
            });;
    }

    render() {
        return (
            <div id="main">
                <div id="preloader" className="loading-screen"
                    style={this.state.isLoading ? { display: "block" } : { display: "none" }}>
                    <div className="loading-animation">
                        <div className="loading-bar"></div>
                    </div>
                </div>


                <div id="formContainer" className={`formContainer ${this.state.buttonActionClass}`}>
                    <div className="content login">
                        <div className="container">
                            <div className="left redirectSide">
                                <h1>Hello, Friend!</h1>
                                <p>Enter you personal details<br />and start journey with us</p>
                                <button id="goToSignUp" onClick={this.goToSignUp} className="btn">SING UP</button>
                            </div>
                            <div className="right mainSide">
                                <h1>Sign in to <br /> <b>WebRecipes</b></h1>

                                <div className="form-group">
                                    <input type="email" className="form-control"
                                        id="loginForm" aria-describedby="emailHelp"
                                        value={this.state.usernameLogIn}
                                        name="usernameLogIn"
                                        onChange={this.handleChange}
                                        placeholder="Email" />
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control"
                                        id="passwordForm" placeholder="Password"
                                        value={this.state.passwordLogIn}
                                        onChange={this.handleChange}
                                        name="passwordLogIn" />
                                </div>

                                <p id="forgotPassword">Forgot your password?</p>
                                <hr />

                                <button type="submit" id="loginBtn" className="btn" onClick={this.logIn}>SIGN IN</button>
                                <div id="errorBlock" className="alert alert-danger mt-3"
                                    style={this.state.isError ? { display: "block" } : { display: "none" }}>
                                    {this.state.errorMessage}</div>
                            </div>

                        </div>
                    </div>
                    <div className="content signup">
                        <div className="container">
                            <div className="left mainSide">
                                <h1>Create Account</h1>

                                <div className="form-group">
                                    <input type="text" className="form-control"
                                        id="nameFormReg" aria-describedby="emailHelp"
                                        name="nameSignUp"
                                        onChange={this.handleChange}
                                        placeholder="Name" />
                                </div>

                                <div className="form-group">
                                    <input type="text" className="form-control"
                                        id="usernameFormReg" aria-describedby="emailHelp"
                                        name="usernameSignUp"
                                        onChange={this.handleChange}
                                        placeholder="Username" />
                                </div>

                                <div className="form-group">
                                    <input type="email" className="form-control"
                                        id="loginFormReg" aria-describedby="emailHelp"
                                        name="emailSignUp"
                                        onChange={this.handleChange}
                                        placeholder="Email" />
                                </div>
                                <div className="form-group">
                                    <input type="Password" className="form-control"
                                        id="passwordFormReg" placeholder="Password"
                                        name="passwordSignUp"
                                        onChange={this.handleChange} />
                                </div>

                                <button type="submit" id="regBtn"
                                    onClick={this.signUp}
                                    className="btn">SING UP</button>
                                <div id="errorBlockReg"
                                    style={this.state.isErrorSignUp ? { display: "block" } : { display: "none" }}
                                    className="alert alert-danger mt-3">{this.state.errorMessage}</div>
                            </div>
                            <div className="right redirectSide">
                                <h1>Welcome Back!</h1>
                                <p>To keep connected with us please<br />login with your personal info</p>
                                <button id="goToLogIn" onClick={this.goToLogIn} className="btn">SIGN IN</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Access;