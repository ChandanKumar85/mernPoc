import React, { memo } from 'react'

const Child = ({ passData }) => {
    console.log("Child Component...")
    return (
        <>
            <h3>Hello India {passData}</h3>
        </>
    )
}

export default memo(Child)