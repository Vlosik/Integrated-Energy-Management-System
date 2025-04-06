import {Component} from "react";
import {Link} from "react-router-dom";
import './ShowDevices.css';
import { MdAdminPanelSettings } from "react-icons/md";
import axiosInstance from "../../axios";
import history from "../../history";
import axiosDevice from "../../axiosDevice";


class ShowDevices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adminName: localStorage.getItem('admin'),
            devices: ''
        }
    }

    componentDidMount() {
        this.getDevices();
    }

    getDevices() {
        axiosDevice.post("device/getAll",{},{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(response => {
            if(response.data !== null){
                this.setState({devices: response.data});
                console.log(this.state.devices);
            }
        })
    }

    editDevice(index) {
        const device = this.state.devices[index];
        localStorage.setItem('editDescription', device.description);
        localStorage.setItem('editAddress', device.address);
        localStorage.setItem('editConsumption', device.consumption);
        localStorage.setItem('editClientId', device.user.client);
        localStorage.setItem('editDeviceId', device.id);

        history.push("/editDevice");
        window.location.reload();
    }

    deleteDevice(index) {
        const device = this.state.devices[index];
        const value = {
            deviceID : device.id,
            description : device.description,
            address : device.address,
            userId : device.user.client,
            consumption :device.consumption
        }

        axiosDevice({
            method: 'delete',
            url: '/device/delete',
            data: value,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(response => {
            if(response.data !== null){
                window.location.reload();
            }
        })
    }

    render() {
        const { devices } = this.state;
        return (
            <div className="show-devices">
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
                    <div className="table-devices">
                        <table>
                            <thead>
                            <tr>
                                <th>Description</th>
                                <th>Address</th>
                                <th>Consumption</th>
                                <th>User ID</th>
                                <th>Edit Device</th>
                                <th>Delete Device</th>
                            </tr>
                            </thead>
                            <tbody>
                            {devices && devices.length ? (
                                devices.map((device, index) => (
                                    <tr key={device.id}>
                                        <td>{device.description}</td>
                                        <td>{device.address}</td>
                                        <td>{device.consumption}</td>
                                        <td>{device.user.client}</td>
                                        <td>
                                            <button onClick={() => this.editDevice(index)}>Edit</button>
                                        </td>
                                        <td>
                                            <button onClick={() => this.deleteDevice(index)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No devices found</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default ShowDevices;