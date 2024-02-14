import { Box, Button, Card, Checkbox, TextField, Typography } from '@mui/material'
import { useCallback, useMemo, useRef, useState } from 'react';
import Child from './Child';
import Child2 from './LiftingStateUp';
// import User from './higherOrder/User';
// import Todo from './higherOrder/Todo';

const Dashboard = () => {
    const productsVal = [
        { "status": 'false', "quantity": 1000, "balance": 900 },
        { "status": 'false', "quantity": 2000, "balance": 2000 },
        { "status": 'false', "quantity": 500, "balance": 500 },
    ];
    const [showInput, setShowInput] = useState(false);

    const handleChange = (e) => {
        console.log(e)
    }
    const handleCheckbox = (e) => {
        if (e.target.checked) {
            setShowInput(true)
        }
    }





    // useRef
    const refElement = useRef(null);
    const [name, setName] = useState('');
    const reset = () => {
        setName('')
        refElement.current.focus();
    }


    {/* useMemo */ }
    const [inc, setInc] = useState(0);
    const [dec, setDec] = useState(0);
    const multiplication = useMemo(() => {
        console.log("***************");
        return inc * 10;
    }, [inc])



    {/* useCallback */ }
    const [count, setCount] = useState(0)
    const learning = useCallback(() => { }, [count])


    // Lifting State Up
    function getData(data) {
        console.log(data)
    }


    return (
        <>
            <Box sx={{ display: 'flex', marginBottom: "20px", flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" component="h2">Dashboard</Typography>
            </Box>
            {/* <Card sx={{ maxWidth: 700, padding: '10px', marginBottom: "20px" }}>
                <Box>
                    <ul className='list-price heading'>
                        <li><strong>Quantity</strong></li>
                        <li><strong>Balance</strong></li>
                        <li>{showInput && <Button>Add+</Button>}</li>
                    </ul>
                </Box>
                {
                    productsVal?.map((value, index) => (
                        <Card key={index} sx={{ maxWidth: 600, display: 'flex', alignItems: 'center', boxShadow: 'none' }}>
                            <Checkbox value="remember" color="primary" onChange={handleCheckbox} />
                            <ul className='list-price'>
                                <li>{value.quantity}</li>
                                <li>{value.balance}</li>
                            </ul>
                        </Card>
                    ))
                }
                {showInput && <Box sx={{ marginLeft: '10px' }}>
                    <TextField
                        margin="normal"
                        id="number"
                        name="number"
                        type='number'
                        className='number-input'
                        onChange={handleChange}
                    />
                </Box>}
            </Card> */}



            {/* // useRef */}
            <h2 style={{ marginBottom: 0 }}>UseRef</h2>
            <input type="text" value={name} ref={refElement} onChange={e => setName(e.target.value)} />
            <Button onClick={reset}>Reset</Button>



            {/* useMemo */}
            <h2 style={{ marginBottom: 0 }}>UseMemo</h2>
            <Button onClick={() => setInc(inc + 1)}>Addition ===== <strong>{' '}{multiplication}</strong></Button>
            <Button onClick={() => setDec(dec - 1)}>Subtraction ===== <strong>{' '}{dec}</strong></Button>



            {/* useCallback */}
            <h2 style={{ marginBottom: 0 }}>useCallback</h2>
            <Child learning={learning} />
            <Button onClick={() => setCount(count + 1)}>Increase {count}</Button>


            {/* Lifting State Up */}
            <Child2 setData={getData} />



            {/* <section className='listView'>
                <div><User /></div>
                <div><Todo /></div>
            </section> */}
        </>
    )

}

export default Dashboard
