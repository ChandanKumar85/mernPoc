import React, { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Dashboard from "./Dashboard";
import Employee from "./Employees";
import Profile from "../Auth/Profile";
import NotFoundPage from "./NotFoundPage";
import ChangePassword from '../Auth/ChangePassword';
import UpdateProfile from '../Auth/Profile/UpdateProfile';
import EmployeeForm from './Employees/form';
// import Dashboard = React.lazy(()=>import("./Dashboard"))

const AppRoute = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname === '/') {
            navigate('/dashboard');
        }
    }, [navigate])

    return (
        <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<Employee />} />
            <Route path="add-employee" element={<EmployeeForm />} />
            <Route path="update-employee/:employeeId" element={<EmployeeForm />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<UpdateProfile />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}

export default AppRoute
