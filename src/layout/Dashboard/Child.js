import React, { memo } from 'react'

const Child = (learning) => {
    console.log("Child Component")
    return (
        <>
            {/* <h3>Hello India</h3> */}
        </>
    )
}

export default memo(Child)