import { Button } from '@mui/joy';
import { Box, Grid, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

const formBuild = {
    name: {
        label: 'Name1',
        type: 'text',
    },
    email: {
        label: 'Email',
        type: 'email',
    },
    phone: {
        label: 'Phone',
        type: 'tel',
    },
    profileImg: {
        label: 'Profile Image',
        type: 'file',
    },
    address: {
        label: 'Address',
        type: 'file',
    },
}

const GenericForm = (props) => {

    const { buttonValue } = props;

    const [formData, setFormData] = useState(
        Object.fromEntries(Object.keys(formBuild).map((key) => [key, '']))
    );
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        const newErrors = {};

        // Basic email validation
        if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Basic password validation (at least 6 characters)
        if (!formData.password || formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);

        // Return true if there are no errors
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {

        if (validateForm()) {
            console.log('Form data submitted:', formData);

            // Add logic to send the data to your server or perform other actions.
        } else {
            console.log('Form has errors. Please fix them.');
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" component="h2">Add Employee</Typography>
            </Box>
            <Grid container>
                <form style={{ width: "100%" }}>
                    {Object.keys(formBuild).map((res) => (
                        <div key={res} >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="text"
                                label="User Name"
                                name={res.label}
                                autoComplete="off"
                                autoFocus
                            />
                        </div>
                    ))}
                </form>
            </Grid >

            <Button type='button' onSubmit={handleSubmit}>{buttonValue}</Button>
        </>
    )
}

export default GenericForm
