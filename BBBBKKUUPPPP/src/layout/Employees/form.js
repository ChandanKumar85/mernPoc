import { Alert, AlertTitle, Avatar, Box, Button, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DatepickerWrapper } from './formStyled';
import { content } from '../../Utils/Constants';
import Authentication from '../../Utils/Authentication';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';

const skills = [
    { value: "react-developer", label: "React Developer" },
    { value: "angular-developer", label: "Angular Developer" },
    { value: "ui-developer", label: "UI Developer" },
    { value: "java-developer", label: "Java Developer" },
    { value: "ios-developer", label: "IOS Developer" },
    { value: "vue-developer", label: "VUE Developer" },
    { value: "php-developer", label: "PHP Developer" }
]

const EmployeeForm = () => {
    const formInitialVal = { name: '', email: '', phone: '', age: '', designation: '', picture: null, userID: '' }
    const [initialValue, setInitialValue] = useState(formInitialVal);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(false);
    const { http } = Authentication();
    const userID = localStorage.getItem("userID");
    const token = localStorage.getItem(content.ACCESS_TOKEN);

    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_BASE_URL
    const { employeeId } = useParams()
    const [employees, setEmployees] = useState(null)
    const [spinner, setSpinner] = useState(false)
    const [empCheck, setEmpCheck] = useState(false)

    const location = useLocation()
    const {userName} = location.state || {};

    const validateForm = values => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

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
        } else if (values.phone.length > 15) {
            errors.phone = "Mobile number should be maximum 15 digits."
        }

        if (!values.age) {
            errors.age = "This field is required!"
        }

        if (!values.designation) {
            errors.designation = "This field is required!"
        }

        // if (!values.picture) {
        //     errors.picture = "This field is required!"
        // }
        return errors;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInitialValue({ ...initialValue, [name]: value });
    }

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setInitialValue({ ...initialValue, picture: file });
    }

    useEffect(() => {
        setTimeout(() => {
            setMessage(false)
        }, 5000)
        setTimeout(() => {
            setEmpCheck(false)
        }, 5000)
    }, [initialValue, empCheck])

    useEffect(() => {
        if (employeeId) {
            http.get(`api/employee/show/${employeeId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(res => {
                setEmployees(res.data.response)
            }).catch((err) => {
                console.log(err)
            })
        }
    }, [employeeId])

    useEffect(() => {
        if (employees) {
            const flattenedObject = {
                _id: employees._id,
                name: employees.name,
                email: employees.email,
                phone: employees.phone,
                picture: employees.picture,
                age: employees.age,
                designation: employees.designation
            };
            setInitialValue(flattenedObject);
        }
    }, [employees])

    const back = () => {
        navigate("/employees")
    }

    // Add Employee
    const handleSubmit = () => {
        const errors = validateForm(initialValue)
        setErrors(errors);
        if (Object.keys(errors).length) {
            return false
        }
        setSpinner(true)
        const formValue = { ...initialValue, userID }
        http.post('api/employee/store', formValue, {
            headers: {
                'Authorization': `Bearer ${token}`.replace(/"/g, ""),
                'Content-Type': 'multipart/form-data',
            }
        }).then((res) => {
            if (res.data.message === "EMPLOYEE_ALREADY_EXISTS") {
                setEmpCheck(true)
                setSpinner(false)
                return
            }
            if (res.data.message === "ADDED_SUCCESSFULLY") {
                setInitialValue(formInitialVal)
                setErrors({})
                setMessage(true)
                setSpinner(false)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    // Update Data
    const handleUpdateValue = () => {
        const errors = validateForm(initialValue)
        setErrors(errors);
        if (Object.keys(errors).length) {
            return false
        }
        setSpinner(true)
        const employeeID = initialValue._id;
        const formValue = { ...initialValue, userID, employeeID }
        http.put('api/employee/update', formValue, {
            headers: {
                'Authorization': `Bearer ${token}`.replace(/"/g, ""),
                'Content-Type': 'multipart/form-data',
            }
        }).then((res) => {
            if (res.data.message === "UPDATE_SUCCESSFULLY") {
                setInitialValue(formInitialVal)
                setErrors({})
                navigate("/employees")
                setSpinner(false)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <>
            {empCheck && <Alert sx={{ marginBottom: '20px' }} severity="error">This employee is already exist </Alert>}
            {message && <Alert sx={{ marginBottom: '20px' }} severity="success">
                <AlertTitle>Success</AlertTitle>
                <strong>Employee added successfully.</strong>
            </Alert>}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginBottom: '10px', justifyContent: 'space-between' }}>
                <Typography variant="h5" component="h2">
                    {employeeId && <IconButton onClick={back}> <ArrowBackIcon /> </IconButton>}
                    {employeeId ? "Update Employee Detail" : "Add Employee"}
                    {userName}
                </Typography>
            </Box>
            <Grid container>
                <Grid item xs={4}>
                    <form encType='multipart/form-data'>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="text"
                            label="User Name"
                            name="name"
                            autoComplete="off"
                            autoFocus
                            error={Boolean(errors.name)}
                            helperText={errors.name}
                            value={initialValue.name}
                            onChange={handleInputChange}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="off"
                            error={Boolean(errors.email)}
                            helperText={errors.email}
                            value={initialValue.email}
                            onChange={handleInputChange}
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
                            error={Boolean(errors.phone)}
                            helperText={errors.phone}
                            value={initialValue.phone}
                            onChange={handleInputChange}
                        />

                        <DatepickerWrapper>
                            <FormControl sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    variant='outlined'
                                    type='date'
                                    autoComplete='off'
                                    id='dateOfBirth'
                                    TextField
                                    name="age"
                                    required
                                    error={Boolean(errors.age)}
                                    value={initialValue.age}
                                    helperText={errors.age}
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                        </DatepickerWrapper>

                        <FormControl fullWidth sx={{ mt: 2, minWidth: 100 }}>
                            <InputLabel id="designation">Designation</InputLabel>
                            <Select
                                labelId="designation"
                                id="designation"
                                name="designation"
                                label="Designation"
                                error={Boolean(errors.designation)}
                                value={initialValue.designation}
                                onChange={handleInputChange}
                            >
                                <MenuItem value=""><em>Designation</em></MenuItem>
                                {skills?.map((val, index) => (
                                    <MenuItem key={val.value} value={val.value}>{val.label}</MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <FormHelperText className='Mui-error'>{errors.designation}</FormHelperText>

                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-start' }}>
                            {initialValue.picture?.size ? (
                                <Avatar alt="Avatar" sx={{ width: 80, height: 80 }} src={URL.createObjectURL(initialValue.picture)} />
                            ) : (
                                <Avatar sx={{ width: 80, height: 80 }} alt={initialValue?.name} src={`${baseURL}${initialValue?.picture}`} />
                            )}
                            <label>
                                <Button variant="contained" component="span">
                                    Upload Profile Image
                                </Button>
                                <input hidden
                                    accept="image/*"
                                    type="file"
                                    name="picture"
                                    onChange={handleAvatarChange}
                                />
                            </label>
                        </Box>

                        {!employeeId ? (
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, height: '44px' }}
                                onClick={handleSubmit}
                                disabled={spinner}
                            >
                                {spinner ? (<CircularProgress color="inherit" size={20} />) : "Submit"}
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, height: '44px' }}
                                onClick={handleUpdateValue}
                                disabled={spinner}
                            >
                                {spinner ? (<CircularProgress color="inherit" size={20} />) : "Submit to Update"}
                            </Button>
                        )}
                    </form>
                </Grid>
            </Grid>
        </>
    )
}

export default EmployeeForm