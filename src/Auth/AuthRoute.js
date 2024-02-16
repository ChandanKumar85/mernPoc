import { Route, Routes, useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from './ForgotPassword';

const AuthRoute = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname === '/register') {
            navigate('/register');
        } else if (pathname === '/forgot-password') {
            navigate('/forgot-password');
        } else if (pathname !== '/') {
            navigate('/login');
        }
    }, [navigate])

    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route index path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
        </Routes>
    )
}

export default AuthRoute



































// import { Route, Router, Routes, useNavigate, Redirect } from 'react-router-dom'
// import React, { useEffect } from 'react'
// import Login from "./Login";
// import Register from "./Register";
// import ForgotPassword from './ForgotPassword';
// import Dashboard from '../layout';

// const AuthRoute = () => {
//     const navigate = useNavigate();

//     useEffect(() => {
//         const pathname = window.location.pathname;
//         if (pathname === '/register') {
//             navigate('/register');
//         } else if (pathname === '/forgot-password') {
//             navigate('/forgot-password');
//         } else if (pathname !== '/') {
//             navigate('/login');
//         }
//     }, [navigate])

//     const routes = [
//         { path: "/login", component: Login },
//         { path: "/register", component: Register },
//         { path: "/forgot-password", component: ForgotPassword },
//         { path: "/", exact: true, component: Dashboard },
//     ];

//     return (
//         <Routes>
//             {routes.map((item) => {
//                 const { component: Component } = item;
//                 return (
//                     <Route
//                         exact={item.exact} path={item.path} component={item.component} key={item.path}
//                         render={(routeProp) => {
//                             // if (false) {
//                             //     return <Redirect to={}
//                             // }
//                             return <Component {...routeProp} />
//                         }}
//                     />
//                 )
//                 // <RenderRouteComponents exact={item.exact} path={item.path} component={item.component} key={item.path} />
//             })}
//         </Routes>
//     )
// }

// export default AuthRoute