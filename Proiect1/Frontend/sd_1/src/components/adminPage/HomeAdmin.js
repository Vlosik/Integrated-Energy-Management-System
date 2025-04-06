import { Component } from "react";
import { Link } from "react-router-dom";
import './HomeAdmin.css';
import {MdAdminPanelSettings, MdChat, } from "react-icons/md";
import axiosInstance from "../../axios";
import history from "../../history";

class AdminPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            adminName: localStorage.getItem('admin'),
            currentPage: 0,
            usersPerPage: 4,
            token: localStorage.getItem('token'),
        };
    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers() {
        axiosInstance.post("user/getUsers",{},{
            headers: {
                Authorization: `Bearer ${this.state.token}`,
            },
        }).then(response => {
            if (response.data !== null) {
                this.setState({ users: response.data });
            }
        });
    }

    editUser(index) {
        localStorage.setItem('editUsername', this.state.users[index].username);
        localStorage.setItem('editRole', this.state.users[index].role);
        localStorage.setItem('editPassword', this.state.users[index].password);
        localStorage.setItem('editEmail', this.state.users[index].email);
        localStorage.setItem('editId', this.state.users[index].id);
        history.push("/editUser");
        window.location.reload();
    }

    deleteUser(index) {
        const user = this.state.users[index];
        const value = { username: user.username };

        axiosInstance({
            method: 'delete',
            url: '/user/delete',
            data: value,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }).then(response => {
            if (response.data !== null) {
                window.location.reload();
            }
        });
    }

    toggleIcon() {
        this.setState(prevState => ({
            isIconActive: !prevState.isIconActive,
        }));
    }

    nextPage() {
        this.setState(prevState => ({
            currentPage: Math.min(prevState.currentPage + 1, Math.floor(prevState.users.length / prevState.usersPerPage))
        }));
    }

    prevPage() {
        this.setState(prevState => ({
            currentPage: Math.max(prevState.currentPage - 1, 0)
        }));
    }

    render() {
        const { users, currentPage, usersPerPage } = this.state;
        const startIndex = currentPage * usersPerPage;
        const paginatedUsers = users.slice(startIndex, startIndex + usersPerPage);

        return (
            <div className="admin-home">
                <div className="top">
                    <div className="elements">
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
                                <Link to="/chatAdmin" className="nav-icon"><MdChat className="icon default"/></Link>
                            </li>
                            <li>
                            <Link to="/" className="nav">Log out</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="bottom">
                    <div className="user-cards">
                        {paginatedUsers.map((user, index) => (
                            <div className="card" key={user.id}>
                                <h2 className="username">{user.username}</h2>
                                <hr/>
                                <p className="email">Email: {user.email}</p>
                                <button type="button" className="edit-button"
                                        onClick={() => this.editUser(startIndex + index)}>Edit
                                </button>
                                <button type="button" className="edit-button"
                                        onClick={() => this.deleteUser(startIndex + index)}>Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="pagination">
                    <button
                        className="pagination-button"
                        onClick={() => this.prevPage()}
                        disabled={currentPage === 0}
                    >
                        Back
                    </button>
                    <button
                        className="pagination-button"
                        onClick={() => this.nextPage()}
                        disabled={startIndex + usersPerPage >= users.length}
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    }
}

export default AdminPage;
