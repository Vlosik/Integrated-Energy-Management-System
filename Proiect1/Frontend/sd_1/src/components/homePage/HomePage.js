import {Component} from "react";
import { Link } from 'react-router-dom';
import './HomePage.css';
import axiosInstance from "../../axios";
import history from "../../history";
import { jwtDecode } from "jwt-decode";


class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    login = (event) => {
        event.preventDefault();
        const { username, password } = this.state;
        const send = {
            username,
            password
        };

        axiosInstance.post("user/login", send).then((response) => {
            if (response.data && response.data.token) {
                const token = response.data.token;
                localStorage.setItem("token", token);

                const decodedToken = jwtDecode(token);
                const role = decodedToken.role;

                localStorage.setItem("Role", role);

                if (role === "CLIENT") {
                    localStorage.setItem('client', username);
                    history.push("/client");
                    window.location.reload();
                } else if (role === "ADMIN") {
                    localStorage.setItem('admin', username);
                    history.push("/admin");
                    window.location.reload();
                } else {
                    alert("Invalid role detected in token");
                }

            } else {
                alert("Invalid username or password");
            }
        }).catch((error) => {
            console.error("Error during login:", error);
            alert("An error occurred during login. Please try again.");
        });
    }

    render() {
        return (
            <div className="HomePage">
                <div className="form">
                    <form onSubmit={this.login}>
                        <h1>Login</h1>
                        <div className="input-box">
                            <input type="text" placeholder="Username" required
                                   onChange={(e) => this.setState({username: e.target.value})}/>
                        </div>

                        <div className="input-box">
                            <input type="text" placeholder="Password" required
                                   onChange={(e) => this.setState({password: e.target.value})}/>
                        </div>

                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default HomePage;