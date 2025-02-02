import { Box, Button, Typography } from '@mui/material'
import { useRef, useState, useCallback, useMemo, useReducer } from 'react';
import LiftingStateUp from './LiftingStateUp';
import Child from './Child';

const Dashboard = () => {

    // Lifting State Up
    function liftingUpData(data) {
        console.log(data)
    }


    // useRef
    const refElement = useRef(null);
    const [uName, setUName] = useState('');
    const resetForm = () => {
        setUName('')
        refElement.current.focus()
    }



    {/* The useMemo and useCallback Hooks are similar. 
    The main difference is that useMemo returns a memoized value and useCallback returns a memoized function.*/}
    // useMemo
    const [inc, setInc] = useState(0);
    const [dec, setDec] = useState(0);
    const multiplication = useMemo(() => {
        console.log("***************");
        return inc * 10;
    }, [inc])


    // useCallback
    const [count, setCount] = useState(0)
    const [add, setAdd] = useState(0)
    const learning = useCallback(() => { }, [count])





    // useReducer
    const initialState = 0;
    const reducer = (state, action) => {
        if (action.type === "ADDITION") {
            return state + 5;
        }
        if (action.type === "SUBTRACTION") {
            return state - 5;
        }
        return state;
    }
    const [state, dispatch] = useReducer(reducer, initialState);




    return (
        <>
            <Box sx={{ display: 'flex', marginBottom: "20px", flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" component="h2">Dashboard</Typography>
            </Box>

            {/* Lifting State Up */}
            <LiftingStateUp setData={liftingUpData} />



            <h2 style={{ marginBottom: 0 }}>2. UseRef</h2>
            <input type="text" value={uName} ref={refElement} onChange={e => setUName(e.target.value)} />
            <Button onClick={resetForm}>Reset</Button>




            {/* The useMemo and useCallback Hooks are similar. 
            The main difference is that useMemo returns a memoized value and useCallback returns a memoized function.*/}

            <h2 style={{ marginBottom: 0 }}>3. UseMemo</h2>
            <Button onClick={() => setInc(inc + 1)}>Addition ===== <strong>{' '}{multiplication}</strong></Button>
            <Button onClick={() => setDec(dec - 1)}>Subtraction ===== <strong>{' '}{dec}</strong></Button>


            <h2 style={{ marginBottom: 0 }}>4. useCallback</h2>
            <Child learning={learning} count={count} />
            <Button onClick={() => setCount(count + 1)}>Increase{count}</Button>
            <Button onClick={() => setAdd(add + 5)}>Add{add}</Button>




            <h2>5. UseReducer</h2>
            {state}
            <Button onClick={() => dispatch({ type: "ADDITION" })}>Addition</Button>
            <Button onClick={() => dispatch({ type: "SUBTRACTION" })}>Subtraction</Button>


        </>
    )

}

export default Dashboard
