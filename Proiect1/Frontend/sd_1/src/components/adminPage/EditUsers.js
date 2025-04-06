import {Component} from "react";
import {Link} from "react-router-dom";
import './EditUsers.css';
import { MdAdminPanelSettings } from "react-icons/md";
import axiosInstance from "../../axios";
import history from "../../history";


class EditUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adminName: localStorage.getItem('admin'),
            username: localStorage.getItem('editUsername'),
            email: localStorage.getItem('editEmail'),
            password: localStorage.getItem('editPassword'),
            id: localStorage.getItem('editId'),
            role: localStorage.getItem('editRole')
        }
    }

    editUser = (event)  => {
        event.preventDefault();
        const { username, password, email, id, role } = this.state;
        const value = {
            id,
            username,
            password,
            email,
            role
        }
        axiosInstance.put("user/update", value, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(response => {
            if(response.data !== null){
                history.push("/admin");
                window.location.reload();
            }
        });
    }

    render() {
        return (
            <div className="edit-users">
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
                                <Link to="/admin" className="nav" id="show">Show Users</Link>
                            </li>
                            <li>
                                <Link to="/addUser" className="nav">Add User</Link>
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
                        <form onSubmit={this.editUser}>
                            <h1>Edit User</h1>
                            <div className="input-box">
                                <input type="text" value={this.state.id} readOnly/>
                            </div>
                            <div className="input-box">
                                <input type="text" value={this.state.username}
                                       onChange={(e) => this.setState({username: e.target.value})}/>
                            </div>
                            <div className="input-box">
                                <input type="text" value={this.state.password}
                                       onChange={(e) => this.setState({password: e.target.value})}/>
                            </div>
                            <div className="input-box">
                                <input type="text" value={this.state.email}
                                       onChange={(e) => this.setState({email: e.target.value})}/>
                            </div>
                            <div className="input-box">
                                <input type="text" value={this.state.role} readOnly/>
                            </div>
                            <button type="submit" className="button-update">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default EditUsers;