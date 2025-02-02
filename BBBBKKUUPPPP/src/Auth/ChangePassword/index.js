import { Box, Button, CircularProgress, FormHelperText, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Authentication from '../../Utils/Authentication';
import { content } from '../../Utils/Constants';
import { UserContext } from '../../Utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Buffer } from 'buffer';

const ChangePassword = () => {
    const token = localStorage.getItem(content.ACCESS_TOKEN);
    const formInitialVal = { _id: '', oldPassword: '', password: '', cnfPassword: '' }
    const [formErrors, setFormErrors] = useState({});
    const [initialValue, setInitialValue] = useState(formInitialVal)
    const { user } = React.useContext(UserContext)
    const { http } = Authentication();
    const navigate = useNavigate();
    const [wrongPass, setWrongPass] = useState(false)
    const [spinner, setSpinner] = useState(false)
    const [passIcon, setPassIcon] = useState(false)
    const [newPassIcon, setNewPassIcon] = useState(false)
    const [cnfPassIcon, setCnfPassIcon] = useState(false)

    useEffect(() => {
        if (user) {
            setInitialValue({ userID: user._id });
        }
    }, [user]);

    const validateMsg = (values) => {
        const errors = {};
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!values.oldPassword) {
            errors.oldPassword = "This filed is required."
        }
        // else if (values.oldPassword) {
        //     errors.oldPassword = "Wrong password"
        // }

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
    const newPassShowHide = () => {
        setNewPassIcon(!newPassIcon)
    }
    const cnfPassShowHide = () => {
        setCnfPassIcon(!cnfPassIcon)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInitialValue({ ...initialValue, [name]: value })
    }

    const handleSubmit = () => {
        const errors = validateMsg(initialValue)
        setFormErrors(errors)
        if (Object.keys(errors)?.length) {
            setWrongPass(false)
            return false
        }
        setSpinner(true)
        const withoutCnfAndOldPassword = { ...initialValue };
        if (withoutCnfAndOldPassword.hasOwnProperty('cnfPassword')) {
            delete withoutCnfAndOldPassword.cnfPassword;
        }
        const { oldPassword, password, userID } = withoutCnfAndOldPassword
        const credentials = Buffer.from(`${oldPassword}:${password}:${userID}`).toString('base64')
        http.put('auth-api/update-password', { credentials }, {
            headers: {
                'Authorization': `Bearer ${token}`.replace(/"/g, ""),
            }
        }).then((res) => {
            if (res.data.message === "PASSWORD_UPDATED") {
                setInitialValue(formInitialVal)
                setFormErrors({})
                navigate('/profile')
            } else if (res.data.message === "WRONG_OLD_PASSWORD") {
                setWrongPass(true)
            } else {
                console.log("Something went wrong")
            }
            setSpinner(false)
        }).catch((err) => {
            console.log(err)
            setSpinner(false)
        })

    }

    return (
        <Box sx={{ width: '30%' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" component="h2">Change Password</Typography>
            </Box>
            <Box>
                <form style={{ width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="oldPassword"
                        label="Old Password"
                        type={passIcon ? "text" : "password"}
                        id="oldPassword"
                        autoComplete="off"
                        InputProps={{
                            endAdornment: <InputAdornment position='end'>
                                <IconButton aria-label="delete" onClick={passShowHide}>
                                    {passIcon ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                            </InputAdornment>,
                        }}
                        error={Boolean(formErrors.oldPassword)}
                        helperText={formErrors.oldPassword}
                        value={initialValue.oldPassword}
                        onChange={handleChange}
                    />
                    {wrongPass && <FormHelperText className='Mui-error'>Wrong Password</FormHelperText>}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="New Password"
                        type={newPassIcon ? "text" : "password"}
                        id="password"
                        autoComplete="off"
                        InputProps={{
                            endAdornment: <InputAdornment position='end'>
                                <IconButton aria-label="delete" onClick={newPassShowHide}>
                                    {newPassIcon ? <VisibilityIcon /> : <VisibilityOffIcon />}
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
                        label="New Password Re-enter"
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
                        {spinner ? (<CircularProgress color="inherit" size={20} />) : "Change Password"}
                    </Button>
                </form>
            </Box>
        </Box>
    )
}

export default ChangePassword