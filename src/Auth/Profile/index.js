import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { UserContext } from '../../Utils/AuthContext';
import { Grid } from '@mui/material';

export default function BioCard() {
    const baseURL = process.env.REACT_APP_BASE_URL
    const { user } = React.useContext(UserContext)
    const { name, email, phone, address, picture } = user;

    // const localStData = JSON.parse(localStorage.getItem('userID'))
    // if (localStData?.email_verified) {
    //     var newValue = { ...user, localStData }
    // }
    // const data = localStData?.email_verified ? newValue?.localStData : user;

    // const avatarContent =
    //     data?.email_verified ? (
    //         <Avatar sx={{ width: 40, height: 40 }} alt={data?.name} src={data?.picture} />
    //     ) : (
    //         data?.picture && <Avatar sx={{ width: 40, height: 40 }} alt={data?.name} src={`${baseURL}${data?.picture}`} />
    //     );
    {/* {avatarContent || <Avatar sx={{ width: 40, height: 40 }}>{data?.name?.charAt(0).toUpperCase()}</Avatar>} */ }

    return (
        <Box>
            {user ? (
                <Box sx={{ marginRight: '30px' }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h5" component="h1">User Profile</Typography>
                    </Box>
                    <Card
                        sx={{
                            width: 480,
                            maxWidth: '100%',
                            boxShadow: 'lg',
                            marginTop: '20px'
                        }}
                    >
                        <CardContent>
                            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                {picture?.size ? (
                                    <Avatar alt="Avatar" sx={{ width: 60, height: 60 }} src={URL.createObjectURL(picture)} />
                                ) : (
                                    <Avatar sx={{ width: 60, height: 60 }} alt={name} src={`${baseURL}${picture}`} />
                                )}
                                <Link to="edit" variant="body2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><EditIcon fontSize="inherit" />Edit</Link>
                            </Box>
                            <Typography sx={{ marginTop: '10px' }} level="title-lg">{name}</Typography>
                            <Typography level="body-sm"><strong>Email ID:</strong> {email}</Typography>
                            {phone && <Typography level="body-sm"><strong>Contact Number:</strong> {phone}</Typography>}
                            {(address?.houseNo !== undefined) &&
                                <>
                                    <Typography sx={{ marginTop: '10px' }} level="title-md">Address :</Typography>
                                    <Typography level="body-sm">
                                        <strong>House No: </strong>{address?.houseNo},
                                        <strong> Landmark: </strong>{address?.landmark},
                                        <strong> Pin Code: </strong>{address?.pinCode},
                                        <strong> City: </strong>{address?.city},
                                        <strong> State: </strong>{address?.state}
                                    </Typography>
                                </>
                            }
                        </CardContent>
                    </Card>
                </Box>
            ) : (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={2}>Loading...</Grid>
                </Grid>
            )
            }
        </Box>
    )
}