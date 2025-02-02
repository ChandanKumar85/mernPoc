import { Box, Grid, IconButton, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ProfileCard from '../../Components/ProfileCard';
import { DialogBox } from '../../Components/DialogBox';
import { Link } from 'react-router-dom';
import { content } from '../../Utils/Constants';
import Authentication from '../../Utils/Authentication';
import { UserContext } from '../../Utils/AuthContext';

const Employee = () => {
  const token = localStorage.getItem(content.ACCESS_TOKEN);
  const { http } = Authentication();
  const { user, setUser } = React.useContext(UserContext);

  const [data, setData] = useState(null);
  const [deleteModelPop, setDeleteModelPop] = useState(false)
  const [modelData, setModelData] = useState()
  const [updateVal, setUpdateVal] = useState()
  const [spinner, setSpinner] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const response = await http.get(`api/employee/show-employee/${user._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
        );
        setData(response.data.users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
  }, [updateVal, user._id, token]);

  const deleteModel = (value) => {
    setDeleteModelPop(!deleteModelPop)
    setModelData(value)
  }

  const handleDeleteEmp = () => {
    setSpinner(true)
    http.delete(`api/employee/delete/${modelData._id}`, {
      headers: {
        'Authorization': `Bearer ${token}`.replace(/"/g, "")
      }
    }).then((res) => {
      if (res.data.message === "DELETE_SUCCESSFULLY") {
        setUpdateVal(res.data)
        setDeleteModelPop(!deleteModelPop)
        setModelData(null)
        setSpinner(false)
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  const cardBox = data?.slice().reverse().map((value, index) => (
    <Grid item xs={3} key={value._id} className="card-width">
      <ProfileCard data={value}>
        <Stack direction="row" spacing={1} style={{ position: "absolute", top: "10px", right: "10px" }}>
          <Link to={`/update-employee/${value._id}`} variant="body2" style={{ top: "5px", position: 'relative' }}><EditIcon fontSize="inherit" /></Link>
          <IconButton aria-label="delete" color="secondary" size="small" onClick={() => deleteModel(value)}>
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Stack>
      </ProfileCard>
    </Grid>
  ))

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" component="h2">Employee Listing</Typography>
      </Box>

      {(data?.length > 0) ? (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {cardBox}
        </Grid>
      ) : (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={2}>Loading...</Grid>
        </Grid>
      )}
      <DialogBox
        title={'You want to delete this employee?'}
        cancelBtn={'Close'}
        submitBtn="Yes"
        onSubmit={handleDeleteEmp}
        openModal={deleteModelPop}
        closeModel={deleteModel}
        spinner={spinner}
        modelData={modelData?.name}
      />
    </>
  )
}

export default Employee