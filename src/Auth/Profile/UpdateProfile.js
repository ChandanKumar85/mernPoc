import { Avatar, Box, CircularProgress, FormControl, FormHelperText, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Typography from '@mui/joy/Typography';
import { Button } from '@mui/joy';
import Authentication from '../../Utils/Authentication';
import { content } from '../../Utils/Constants';
import { UserContext, UserUpdate } from '../../Utils/AuthContext';

const UpdateProfile = () => {
    const formInitialVal = {
        name: '',
        email: '',
        phone: '',
        picture: '',
        houseNo: '',
        landmark: '',
        pinCode: '',
        city: '',
        state: ''
    }

    const validateMsg = (values) => {
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
        }

        return errors;
    }

    const [initialValue, setInitialValue] = useState(formInitialVal);
    const [errors, setErrors] = useState({});
    const { http, saveUser } = Authentication();
    const [spinner, setSpinner] = useState(false)

    const token = localStorage.getItem(content.ACCESS_TOKEN);
    const baseURL = process.env.REACT_APP_BASE_URL
    const { user } = React.useContext(UserContext)
    const { userUpdate, setUserUpdate } = React.useContext(UserUpdate)
    const { _id, name, email, phone, picture, address } = user

    useEffect(() => {
        if (user) {
            const flattenedObject = {
                userID: _id,
                name: name,
                email: email,
                phone: phone,
                picture: picture,
                houseNo: address?.houseNo,
                landmark: address?.landmark,
                pinCode: address?.pinCode,
                city: address?.city?.toLowerCase(),
                state: address?.state?.toLowerCase(),
            };
            setInitialValue(flattenedObject);
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInitialValue({ ...initialValue, [name]: value })
    }

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setInitialValue({ ...initialValue, picture: file });
    };

    const handleSubmit = () => {
        const errors = validateMsg(initialValue)
        setErrors(errors)
        if (Object.keys(errors)?.length) {
            return false
        }
        setSpinner(true)
        http.put('auth-api/update-user', initialValue, {
            headers: {
                'Authorization': `Bearer ${token}`.replace(/"/g, ""),
                'Content-Type': 'multipart/form-data', // Make sure to set the content type
            }
        }).then((res) => {
            if (res.data.message === "USER_UPDATED") {
                setSpinner(false)
                saveUser(res.data.user)
                setInitialValue(formInitialVal)
                setErrors({})
                setUserUpdate(initialValue)
            }

        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <>
            <Box sx={{ width: '30%' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h5" component="h2">Update Profile</Typography>
                </Box>
                <Grid container>
                    <form style={{ width: "100%" }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="text"
                            label="User Name"
                            name="name"
                            autoComplete="off"
                            autoFocus
                            // error={Boolean(errors?.name)}
                            // helperText={errors?.name}
                            value={initialValue?.name}
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
                            // error={Boolean(errors?.email)}
                            // helperText={errors?.email}
                            value={initialValue?.email}
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
                            // error={Boolean(errors?.phone)}
                            // helperText={errors?.phone}
                            value={initialValue?.phone}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="houseNo"
                            label="House No, Company Name"
                            name="houseNo"
                            autoComplete="off"
                            // error={Boolean(errors?.houseNo)}
                            // helperText={errors?.houseNo}
                            value={initialValue?.houseNo}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="landmark"
                            label="Landmark"
                            name="landmark"
                            autoComplete="off"
                            // error={Boolean(errors?.landmark)}
                            // helperText={errors?.landmark}
                            value={initialValue?.landmark}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="pinCode"
                            label="Pin Code"
                            name="pinCode"
                            autoComplete="off"
                            // error={Boolean(errors?.pinCode)}
                            // helperText={errors?.pinCode}
                            value={initialValue?.pinCode}
                            onChange={handleChange}
                        />

                        <FormControl fullWidth sx={{ mt: 2, minWidth: 100 }}>
                            <InputLabel id="city">City</InputLabel>
                            <Select
                                labelId="city"
                                id="city"
                                name="city"
                                label="City Name"
                                // error={Boolean(errors?.city)}
                                // helperText={errors?.city}
                                value={initialValue?.city}
                                onChange={handleChange}
                            >
                                <MenuItem value=""><em>Select City</em></MenuItem>
                                <MenuItem value="noida">Noida</MenuItem>
                                <MenuItem value="grnoida">Greater Noida</MenuItem>
                                <MenuItem value="delhi">Delhi</MenuItem>
                                <MenuItem value="mumbai">Mumbai</MenuItem>
                                <MenuItem value="patna">Patna</MenuItem>
                            </Select>
                        </FormControl>
                        {errors?.city && <FormHelperText className='Mui-error'>{errors?.city}</FormHelperText>}

                        <FormControl fullWidth sx={{ mt: 2, minWidth: 100 }}>
                            <InputLabel id="state">State</InputLabel>
                            <Select
                                labelId="state"
                                id="state"
                                name="state"
                                label="State Name"
                                // error={Boolean(errors?.state)}
                                value={initialValue?.state}
                                onChange={handleChange}
                            >
                                <MenuItem><em>Select State</em></MenuItem>
                                <MenuItem value="up">UP</MenuItem>
                                <MenuItem value="delhi">Delhi</MenuItem>
                                <MenuItem value="maharashtra">Maharashtra</MenuItem>
                                <MenuItem value="bihar">Bihar</MenuItem>
                            </Select>
                        </FormControl>
                        {errors?.state && <FormHelperText className='Mui-error'>{errors?.state}</FormHelperText>}

                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', }}>
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
                                    {errors?.picture && <FormHelperText className='Mui-error' sx={{ ml: 2 }}>{errors?.picture}</FormHelperText>}
                                </label>
                            </Box>


                        </Box>
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
                            <Button type='button' fullWidth sx={{ height: '44px' }} disabled={spinner} onClick={handleSubmit}>
                                {spinner ? (<CircularProgress color="inherit" size={20} />) : "Submit"}
                            </Button>
                        </Box>
                    </form>
                </Grid >
            </Box>
        </>
    )
}

export default UpdateProfile