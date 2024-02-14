import { Alert, Button, CircularProgress, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import Authentication from '../../Utils/Authentication';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Buffer } from 'buffer';

const Register = () => {

  const formInitialVal = { name: '', email: '', phone: '', password: '', cnfPassword: '' }
  const [initialValue, setInitialValue] = useState(formInitialVal)
  const [formErrors, setFormErrors] = useState({});
  const { http, setToken } = Authentication();
  const [spinner, setSpinner] = useState(false)
  const [passIcon, setPassIcon] = useState(false)
  const [cnfPassIcon, setCnfPassIcon] = useState(false)
  const [userCheck, setUserCheck] = useState(false)

  const validateMsg = (values) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const mobileNumber = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!values.name) {
      errors.name = "This filed is required."
    } else if (values.name.length < 3) {
      errors.name = "User name should be minimum 3 characters."
    }

    if (!values.email) {
      errors.email = "This filed is required."
    } else if (!emailRegex.test(values.email)) {
      errors.email = "This is not a valid email."
    }

    if (!values.phone) {
      errors.phone = "This filed is required."
    } else if (values.phone.length < 10) {
      errors.phone = "Mobile number should be minimum 10 digits."
    } else if (values.phone.length > 10) {
      errors.phone = "Mobile number should be maximum 10 digits."
    } else if (!mobileNumber.test(values.phone)) {
      errors.phone = "Mobile number should be only number."
    }

    if (!values.password) {
      errors.password = "This filed is required."
    } else if (values.password.length < 8) {
      errors.password = "Password should be minimum 8 characters."
    } else if (!passwordRegex.test(values.password)) {
      errors.password = "Password should be 1 uppercase, 1 lowercase, 1 special corrector,1 digits and minimum length 8"
    }

    if (!values.cnfPassword) {
      errors.cnfPassword = "This filed is required."
    } else if (values.password !== values.cnfPassword) {
      errors.cnfPassword = "Password not matched."
    }

    return errors;
  }

  const passShowHide = () => {
    setPassIcon(!passIcon)
  }
  const cnfPassShowHide = () => {
    setCnfPassIcon(!cnfPassIcon)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInitialValue({ ...initialValue, [name]: value })
    // const errors = validateMsg(initialValue)
    // setFormErrors(errors)
    // if (Object.keys(errors)?.length) {
    //   return false
    // }
  }

  const handleSubmit = () => {
    const errors = validateMsg(initialValue)
    setFormErrors(errors)
    if (Object.keys(errors)?.length) {
      return false
    }
    else {
      setSpinner(true)
      const { name, email, phone, password } = initialValue;
      const credentials = Buffer.from(`${name}:${email}:${phone}:${password}`).toString('base64')
      http.post('auth-api/register', { credentials })
        .then((res) => {
          if (res.data.message === "USER_ALREADY_EXISTS") {
            setUserCheck(true)
            setSpinner(false)
            return
          }
          if (res.data.message === "LOGIN_SUCCESSFUL") {
            setToken(res.data.token, res.data.userID)
            setInitialValue(formInitialVal)
            setFormErrors({})
            setSpinner(false)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  };

  return (
    <form style={{ width: '100%' }}>
      <Typography component="h1" variant="h5">
        Sign Up
      </Typography>
      {userCheck && <Alert severity="error" sx={{ mt: 2, mb: 1 }}>This user is already exist!</Alert>}
      <TextField
        margin="normal"
        required
        fullWidth
        id="text"
        label="User Name"
        name="name"
        autoComplete="off"
        autoFocus
        error={Boolean(formErrors.name)}
        helperText={formErrors.name}
        value={initialValue.name}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="off"
        error={Boolean(formErrors.email)}
        helperText={formErrors.email}
        value={initialValue.email}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="phone"
        label="Enter Mobile Number"
        name="phone"
        autoComplete="off"
        InputProps={{
          startAdornment: <InputAdornment position='start'>+91</InputAdornment>
        }}
        error={Boolean(formErrors.phone)}
        helperText={formErrors.phone}
        value={initialValue.phone}
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
        InputProps={{
          endAdornment: <InputAdornment position='end'>
            <IconButton aria-label="delete" onClick={passShowHide}>
              {passIcon ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>,
        }}
        error={Boolean(formErrors.password)}
        helperText={formErrors.password}
        value={initialValue.password}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="cnfPassword"
        label="Confirm Password"
        type={cnfPassIcon ? "text" : "password"}
        id="cnfPassword"
        autoComplete="confirm-password"
        InputProps={{
          endAdornment: <InputAdornment position='end'>
            <IconButton aria-label="delete" onClick={cnfPassShowHide}>
              {cnfPassIcon ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>,
        }}
        error={Boolean(formErrors.cnfPassword)}
        helperText={formErrors.cnfPassword}
        value={initialValue.cnfPassword}
        onChange={handleChange}
      />
      <Button
        type="button"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, height: '44px' }}
        onClick={handleSubmit}
        disabled={spinner}
      >
        {spinner ? (<CircularProgress color="inherit" size={20} />) : "Sign Up"}
      </Button>
    </form>
  )
}

export default Register
