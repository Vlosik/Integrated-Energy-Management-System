import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './components/homePage/HomePage';
import HomeClient from './components/userPage/HomeClient';
import HomeAdmin from './components/adminPage/HomeAdmin';
import EditUsers from "./components/adminPage/EditUsers";
import AddUser from "./components/adminPage/AddUser";
import ShowDevices from "./components/adminPage/ShowDevices";
import AddDevice from "./components/adminPage/AddDevice";
import EditDevice from "./components/adminPage/EditDevice";
import ProtectedRoute from "./ProtectedRoute";
import UserCharts from "./components/userPage/UserCharts";
import ChatAdmin from "./components/adminPage/ChatAdmin";

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<HomePage />}></Route>
              <Route
                  path="/admin"
                  element={
                      <ProtectedRoute element={<HomeAdmin />} allowedRoles={['ADMIN']}/>
                  }
              />
              <Route
                  path="/client"
                  element={
                      <ProtectedRoute element={<HomeClient />} allowedRoles={['CLIENT']}/>
                  }
              />
              <Route
                  path="/client/charts"
                  element={
                      <ProtectedRoute element={<UserCharts />} allowedRoles={['CLIENT']}/>
                  }
              />
              <Route
                  path="/editUser"
                  element={
                      <ProtectedRoute element={<EditUsers />} allowedRoles={['ADMIN']}/>
                  }
              />
              <Route
                  path="/addUser"
                  element={
                      <ProtectedRoute element={<AddUser />} allowedRoles={['ADMIN']}/>
                  }
              />
              <Route
                  path="/showDevices"
                  element={
                      <ProtectedRoute element={<ShowDevices />} allowedRoles={['ADMIN']}/>
                  }
              />
              <Route
                  path="/addDevice"
                  element={
                      <ProtectedRoute element={<AddDevice />} allowedRoles={['ADMIN']}/>
                  }
              />
              <Route
                  path="/editDevice"
                  element={
                      <ProtectedRoute element={<EditDevice />} allowedRoles={['ADMIN']}/>
                  }
              />
              <Route
                  path="/chatAdmin"
                  element={
                      <ProtectedRoute element={<ChatAdmin />} allowedRoles={['ADMIN']}/>
                  }
              />
          </Routes>
      </Router>
  );
}

export default App;
