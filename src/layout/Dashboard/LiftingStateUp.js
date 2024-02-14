import { Button } from '@mui/material'
import React, { useState } from 'react'

const Child2 = (props) => {
    const [name, setName] = useState('');

    const handleSubmit = () => {
        props.setData(name)
    }

    return (
        <form>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <Button onClick={handleSubmit}>Submit</Button>
        </form>
    )
}

export default Child2
