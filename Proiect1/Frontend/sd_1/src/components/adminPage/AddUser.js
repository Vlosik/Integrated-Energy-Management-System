import {Component} from "react";
import {Link} from "react-router-dom";
import './AddUser.css';
import { MdAdminPanelSettings } from "react-icons/md";
import axiosInstance from "../../axios";
import history from "../../history";


class EditUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adminName: localStorage.getItem('admin'),
            username: '',
            email: '',
            password: '',
            role: 'CLIENT'
        }
    }

    insert = (event) =>  {
        event.preventDefault();
        const {username, password, email, role} = this.state;
        const value = {
            username,
            password,
            email,
            role
        }
        axiosInstance.post("user/insert", value, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(response => {
            if(response.data !== null){
                history.push("/admin");
                window.location.reload();
            }
        })
    }

    render() {
        return (
            <div className="add-user">
                <div className="top">
                    <div className="elements-edit">
                        <ul>
                            <li>
                                <div className="admin">
                                    <MdAdminPanelSettings className="icon"/>
                                    <h3>{this.state.adminName}</h3>
                                </div>
                            </li>
                            <li>
                                <Link to="/admin" className="nav" >Show Users</Link>
                            </li>
                            <li>
                                <Link to="/addUser" className="nav" id="show">Add User</Link>
                            </li>
                            <li>
                                <Link to="/showDevices" className="nav">Show Devices</Link>
                            </li>
                            <li>
                                <Link to="/addDevice" className="nav">Add Device</Link>
                            </li>
                            <li>
                                <Link to="/" className="nav">Log out</Link>
                            </li>
                        </ul>
                    </div>

                </div>
                <div className="bottom">
                    <div className="form">
                        <form onSubmit={this.insert}>
                            <h1>Add User</h1>
                            <div className="input-box">
                                <input type="text" placeholder="Username" required
                                       onChange={(e) => this.setState({username: e.target.value})}/>
                            </div>
                            <div className="input-box">
                                <input type="text" placeholder="Password" required
                                       onChange={(e) => this.setState({password: e.target.value})}/>
                            </div>
                            <div className="input-box">
                                <input type="text" placeholder="Email" required
                                       onChange={(e) => this.setState({email: e.target.value})}/>
                            </div>
                            <div className="input-box">
                                <input type="text" value={this.state.role} readOnly/>
                            </div>
                            <button type="submit" className="button-update">Insert</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default EditUsers;