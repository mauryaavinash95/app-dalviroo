import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import '../styles/login.css';
import { postLogin } from '../functions/postLogin';
import { setCredentials } from '../functions/credentials';
import history from '../routes/history';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            groupId: "",
            error: null,
            buttonDisabled: false,
            loginButtonText: "Login"
        }
        this.postLogin = postLogin;
        this.setCredentials = setCredentials;
    }

    changeUsername(e) {
        this.setState({
            username: e.target.value.toString().toLowerCase()
        })
    }

    showError(error) {
        if (error && error.toString()) {
            error = error.toString();
        }
        this.setState({
            error
        }, () => {
            setTimeout(() => {
                this.setState({
                    error: null,
                })
            }, 10000);
        })

    }

    changePassword(e) {
        this.setState({
            password: e.target.value
        })
    }

    changeGroupId(e) {
        if (parseInt(e.target.value))
            this.setState({
                groupId: e.target.value
            })
    }

    changeButtonStatus(set = 0) {
        if (set === 1) {
            this.setState({
                loginButtonText: "Logging you in...",
                buttonDisabled: true,
            })
        } else {
            this.setState({
                loginButtonText: "Login",
                buttonDisabled: false,
            })
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        let { username, password, groupId } = this.state;
        console.log("Submit called: ", username, password, groupId);
        if (username && password && groupId) {
            this.changeButtonStatus(1)
            this.postLogin(username, password, groupId)
                .then((resolve) => {
                    console.log("Resolved as: ", resolve);
                    return this.setCredentials(resolve.data)
                })
                .then((res) => {
                    history.push("/home");
                    history.go();
                })
                .catch((err) => {
                    this.changeButtonStatus(0);
                    console.log("Err: ", err);
                    this.showError(err.toString());
                })
        } else {
            this.showError("Please enter username, password & groupId");
        }
    }

    sendToSignUp() {
        history.push("/signup");
        history.go();
    }

    render() {
        return (
            <div tabIndex="0" className="logincontainter">
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <div className="textBox">
                        <TextField
                            hintText="Username"
                            fullWidth={true}
                            autoFocus
                            onChange={this.changeUsername.bind(this)}
                            value={this.state.username}
                        />
                    </div>
                    <div className="textBox">
                        <TextField
                            hintText="Password"
                            type="password"
                            fullWidth={true}
                            onChange={this.changePassword.bind(this)}
                            value={this.state.password}
                        />
                    </div>
                    <div className="textBox">
                        <TextField
                            hintText="GroupID"
                            fullWidth={true}
                            autoFocus
                            onChange={this.changeGroupId.bind(this)}
                            value={this.state.groupId}
                        />
                    </div>
                    <div style={{ color: "red" }}>
                        {this.state.error}
                    </div>
                    <div className="textBox">
                        <RaisedButton
                            type="submit"
                            label={this.state.loginButtonText}
                            fullWidth={true}
                            primary={true}
                            onClick={this.handleSubmit.bind(this)}
                            disabled={this.state.buttonDisabled}
                        />
                    </div>
                    <div className="textBox">
                        <RaisedButton
                            label="Sign up"
                            fullWidth={true}
                            onClick={this.sendToSignUp.bind(this)}
                            disabled={this.state.buttonDisabled}
                        />
                    </div>
                    <div style={{ margin: "auto", textAlign: "center" }}>
                        {
                            this.state.buttonDisabled ?
                                <RefreshIndicator
                                    size={40}
                                    left={10}
                                    top={0}
                                    status="loading"
                                    style={{ display: 'inline-block', position: 'relative', textAlign: "center" }}
                                />
                                :
                                undefined
                        }
                    </div>
                </form>
            </div>
        )
    }
}