import { Button } from '@mui/material'
import React, { useState } from 'react'

const LiftingStateUp = ({ getChildData }) => {

    return (
        <form>
            <Button onClick={() => getChildData("hello")}>Submit</Button>
        </form>
    )
}

export default LiftingStateUp
