import React, { useState } from "react";
import AuthScreen from "./Auth";
import Dashboard from "./layout";
import Authentication from "./Utils/Authentication";
import { GlobalValueContext, GoogleUserContext, UserContext, UserUpdate } from './Utils/AuthContext';
import { ThemeProvider } from "styled-components";
import { dark } from "./Utils/theme";

function App() {
  const { getToken } = Authentication();
  const isLogin = getToken();
  const [user, setUser] = useState({});
  const [googUser, setGoogUser] = useState({});
  const [userUpdate, setUserUpdate] = useState({});
  const [global, setGlobal] = useState('USA...');

  return (
    <ThemeProvider theme={dark}>
      <GoogleUserContext.Provider value={{ googUser, setGoogUser }}>
        <UserContext.Provider value={{ user, setUser }}>
          <UserUpdate.Provider value={{ userUpdate, setUserUpdate }}>
            {!isLogin ? <AuthScreen /> : 
            <GlobalValueContext.Provider value={{global, setGlobal}}>
              <Dashboard />
            </GlobalValueContext.Provider>
            }
          </UserUpdate.Provider>
        </UserContext.Provider>
      </GoogleUserContext.Provider>
    </ThemeProvider>
  );
}

export default App;




















// console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID)
// import { GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from "jwt-decode";
// <GoogleLogin
//   onSuccess={credentialResponse => {
//     const credentialResponseDecode = jwtDecode(credentialResponse.credential)
//     console.log(credentialResponseDecode);
//   }}
//   onError={() => {
//     console.log('Login Failed');
//   }}
// />