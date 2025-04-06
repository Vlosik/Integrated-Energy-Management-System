import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles }) => {
    const role = localStorage.getItem('Role');

    if (allowedRoles.includes(role)) {
        return element;
    } else {
        return <Navigate to="/" />;
    }
};

export default ProtectedRoute;