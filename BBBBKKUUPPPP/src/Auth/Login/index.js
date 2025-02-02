import { Alert, Button, Checkbox, CircularProgress, FormControlLabel, FormHelperText, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Authentication from '../../Utils/Authentication';
import Cookies from 'js-cookie';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Buffer } from 'buffer';

const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const { http, setToken } = Authentication();
  const [initialValue, setInitialValue] = useState({ username: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState(false);
  const [spinner, setSpinner] = useState(false)
  const [passIcon, setPassIcon] = useState(false)
  const [networkErr, setNetworkErr] = useState(false)

  const validateMsg = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "This filed is required."
    }
    if (!values.password) {
      errors.password = "This filed is required."
    }
    return errors;
  }

  useEffect(() => {
    const uid = Cookies?.get('uid');
    if (uid) {
      const decodeValue = Buffer.from(uid, 'base64').toString('utf-8').split(':');
      const [email, password] = decodeValue;
      setInitialValue({ email, password })
    }
  }, []);

  const passShowHide = () => {
    setPassIcon(!passIcon)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInitialValue({ ...initialValue, [name]: value })
  }

  const handleCheckboxChange = (event) => {
    setRememberMe(event.target.checked)
  }

  const handleSubmit = () => {
    const errors = validateMsg(initialValue)
    setFormErrors(errors)
    if (Object.keys(errors)?.length) {
      return false
    }
    setSpinner(true)
    const credentials = Buffer.from(`${initialValue.email}:${initialValue.password}`).toString('base64')
    http.post('auth-api/login', { credentials })
      .then((res) => {
        if (res.data.message !== "NO_USER_FOUND" && res.data.message !== "PASSWORD_NOT_MATCHED") {
          setToken(res.data.token, res.data.userID)
          const rememberMeCred = Buffer.from(`${initialValue.email}:${initialValue.password}`).toString('base64')
          rememberMe && Cookies.set('uid', rememberMeCred, { expires: process.env.GOOGLE_AUTH_EXPIRE_TIME }); // Cookie expiration in days
          setSpinner(false)
        } else {
          setError(true)
          setSpinner(false)
        }
      })
      .catch((err) => {
        console.log(err)
        setSpinner(false)
        setNetworkErr(true)
      })
  }

  useEffect(() => {
    setTimeout(() => {
      setNetworkErr(false)
    }, 5000)
  }, [networkErr])

  return (
    <form style={{ width: '100%' }}>
      {networkErr && <Alert severity="error" sx={{ mt: 2, mb: 1 }}>Network Error!</Alert>}
      <Typography component="h1" variant="h5">
        Sign In
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="off"
        autoFocus
        // error={Boolean(formErrors.email)}
        // helperText={formErrors.email}
        value={initialValue.email}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type={passIcon ? "text" : "password"}
        id="password"
        autoComplete="off"
        // error={Boolean(formErrors.password)}
        // helperText={formErrors.password}
        InputProps={{
          endAdornment: <InputAdornment position='end'>
            <IconButton aria-label="delete" onClick={passShowHide}>
              {passIcon ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>,
        }}
        value={initialValue.password}
        onChange={handleChange}
      />
      {Boolean(formErrors.email || formErrors.password) && <FormHelperText className='Mui-error'>Email & Password is required.</FormHelperText>}
      {error && <FormHelperText className='Mui-error'>Email or Password is invalid.</FormHelperText>}
      <FormControlLabel
        control={<Checkbox value="remember" color="primary" onChange={handleCheckboxChange} />}
        label="Remember me"
      />
      <Button
        type="button"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, height: '44px' }}
        onClick={handleSubmit}
        disabled={spinner}
      >
        {spinner ? (<CircularProgress color="inherit" size={20} />) : "Sign In"}
      </Button>
    </form>
  )
}

export default Login