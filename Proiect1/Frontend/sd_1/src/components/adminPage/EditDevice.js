import {Component} from "react";
import {Link} from "react-router-dom";
import './EditDevice.css';
import { MdAdminPanelSettings } from "react-icons/md";
import axiosInstance from "../../axios";
import history from "../../history";
import axiosDevice from "../../axiosDevice";


class EditDevice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adminName: localStorage.getItem('admin'),
            users: '',
            description: localStorage.getItem('editDescription'),
            address: localStorage.getItem('editAddress'),
            consumption: localStorage.getItem('editConsumption'),
            userID: localStorage.getItem('editClientId'),
            deviceId: localStorage.getItem('editDeviceId')
        }
    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers() {
        axiosInstance.post("user/getUsers", {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(response => {
            if(response.data !== null){
                this.setState({users: response.data});
                console.log(this.state.users);
            }
        })
    }

    update = (event) => {
        event.preventDefault();
        const { description, address, consumption, userID, deviceId } = this.state;
        const value = {
            deviceID: deviceId,
            description,
            address,
            userId : userID,
            consumption
        }

        axiosDevice.put("device/update",value, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(response => {
            if(response.data !== null){
                history.push("/showDevices");
                window.location.reload();
            }
        })
    }

    render() {
        const { users } = this.state;
        return (
            <div className="edit-devices">
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
                                <Link to="/addUser" className="nav">Add User</Link>
                            </li>
                            <li>
                                <Link to="/showDevices" className="nav" id="show">Show Devices</Link>
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
                    <div className="table-edit">
                        <table>
                            <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Username</th>
                                <th>Password</th>
                                <th>Email</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users && users.length ? (
                                Array.from({length: users.length}).map((_, index) => (
                                    <tr key={index}>
                                        <td>{users[index].id}</td>
                                        <td>{users[index].username}</td>
                                        <td>{users[index].password}</td>
                                        <td>{users[index].email}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No devices found</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    <div className="form-device">
                        <form onSubmit={this.update}>
                            <h1>Edit Device</h1>
                            <div className="input-box">
                                <input type="text" value={this.state.deviceId} readOnly/>
                            </div>
                            <div className="input-box">
                                <input type="text" value={this.state.description}
                                       onChange={(e) => this.setState({description: e.target.value})}/>
                            </div>
                            <div className="input-box">
                                <input type="text" value={this.state.address}
                                       onChange={(e) => this.setState({address: e.target.value})}/>
                            </div>
                            <div className="input-box">
                                <input type="text" value={this.state.consumption}
                                       onChange={(e) => this.setState({consumption: e.target.value})}/>
                            </div>
                            <div className="input-box">
                                <input type="text" value={this.state.userID}
                                       onChange={(e) => this.setState({userID: e.target.value})}/>
                            </div>
                            <button type="submit" className="button-add">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default EditDevice;