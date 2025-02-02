import React, { useEffect } from "react";
import AuthScreen from "./Auth";
import Dashboard from "./layout";
import Authentication from "./Utils/Authentication";
import { Route, Routes, useNavigate } from "react-router-dom";
import Employee from "./layout/Employees";
import EmployeeForm from "./Components/FormAddEdit";
import Profile from "./Auth/Profile";
import UpdateProfile from "./Auth/Profile/UpdateProfile";
import ChangePassword from "./Auth/ChangePassword";
import NotFoundPage from "./layout/NotFoundPage";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import ForgotPassword from "./Auth/ForgotPassword";

const RouteApp = () => {
    const { getToken } = Authentication();
    const navigate = useNavigate();


    const isLogin = getToken();
    // useEffect(() => {
    //     const pathname = window.location.pathname;
    //     if (pathname === '/') {
    //         navigate('/dashboard');
    //     }
    // }, [navigate])
    return (
        <>
            {!isLogin ?
                (
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route index path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="forgot-password" element={<ForgotPassword />} />
                    </Routes>
                ) : (
                    <Routes>
                        <Route path="dashboard2" element={<Dashboard />} />
                        <Route path="employees" element={<Employee />} />
                        <Route path="add-employee" element={<EmployeeForm />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="profile/edit" element={<UpdateProfile />} />
                        <Route path="change-password" element={<ChangePassword />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                )
            }
        </>
    )
}

export default RouteApp
