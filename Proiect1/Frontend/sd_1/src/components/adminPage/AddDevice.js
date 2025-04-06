import {Component} from "react";
import {Link} from "react-router-dom";
import './AddDevice.css';
import { MdAdminPanelSettings } from "react-icons/md";
import axiosInstance from "../../axios";
import history from "../../history";
import axiosDevice from "../../axiosDevice";


class AddDevice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adminName: localStorage.getItem('admin'),
            users: '',
            description: '',
            address: '',
            consumption: '',
            userID: ''
        }
    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers() {
        axiosInstance.post("user/getUsers", {},{
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

    insert = (event) => {
        event.preventDefault();
        const { description, address, consumption, userID } = this.state;
        const value = {
            description,
            address,
            userId : userID,
            consumption
        }

        axiosDevice.post("device/insert",value, {
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
            <div className="add-devices">
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
                                <Link to="/showDevices" className="nav" >Show Devices</Link>
                            </li>
                            <li>
                                <Link to="/addDevice" className="nav" id="show">Add Device</Link>
                            </li>
                            <li>
                                <Link to="/" className="nav">Log out</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="bottom">
                    <div className="table-users">
                        <table>
                            <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Username</th>
                                <th>Email</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users && users.length ? (
                                Array.from({length: users.length}).map((_, index) => (
                                    <tr key={index}>
                                        <td>{users[index].id}</td>
                                        <td>{users[index].username}</td>
                                        <td>{users[index].email}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">No devices found</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    <div className="form-device">
                        <form onSubmit={this.insert}>
                            <h1>Add Device</h1>
                            <div className="input-box">
                                <input type="text" placeholder="Description" required
                                       onChange={(e) => this.setState({description: e.target.value})}/>
                            </div>
                            <div className="input-box">
                                <input type="text" placeholder="Address" required
                                       onChange={(e) => this.setState({address: e.target.value})}/>
                            </div>
                            <div className="input-box">
                                <input type="text" placeholder="Consumption" required
                                       onChange={(e) => this.setState({consumption: e.target.value})}/>
                            </div>
                            <div className="input-box">
                                <input type="text" placeholder="User ID" required
                                       onChange={(e) => this.setState({userID: e.target.value})}/>
                            </div>
                            <button type="submit" className="button-add">Insert</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddDevice;