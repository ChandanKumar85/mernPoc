import { useEffect } from "react";

const Helper = (props) => {

    useEffect(() => {
        document.title = props;
    }, [props])

    // return (
    //     <>
    //         <h3>Hello India {passData}</h3>
    //     </>
    // )
}

export default Helper