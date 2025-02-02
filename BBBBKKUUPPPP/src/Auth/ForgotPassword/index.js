import { Button, CircularProgress, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const ForgotPassword = () => {
    const [email, setEmail] = useState()
    const [sendEmail, setSendEmail] = useState(false)
    const [spinner, setSpinner] = useState(false)

    const handleSubmit = () => {
        setSpinner(true)
        console.log(email)
        setTimeout(() => {
            setSendEmail(true)
            setSpinner(false)
        }, 3000);
    }
    return (
        <>
            {!sendEmail ?
                <form style={{ width: '100%' }}>
                    <Typography component="h1" variant="h5">
                        Forgot Password
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
                        onChange={e => setEmail(e.target.value)}
                    />
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
                </form> : <div style={{ display: "flex", alignItems: 'center', justifyContent: 'center', width: '100%', height: '30vh' }}>
                    <p style={{ textAlign: 'center', lineHeight: '28px' }}>
                        <strong>Please check you email to reset password.</strong><br />
                        <Link to="/login">Go to Sign in Screen</Link>
                    </p>
                </div>
            }
        </>
    )
}

export default ForgotPassword