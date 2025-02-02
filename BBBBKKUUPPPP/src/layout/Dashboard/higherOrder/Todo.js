import React, { useEffect, useState } from 'react'

const Todo = () => {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        const fetchTodos = async () => {
            const res = await fetch("https://jsonplaceholder.typicode.com/todos")
            const todosData = await res.json();
            setTodos(todosData)
        }
        fetchTodos();
    }, [])

    const renderTodos = todos.slice(0, 10).map((todo) => {
        return (
            <div key={todo.userId}>
                <p><strong>{todo.title}</strong></p>
            </div>
        )
    })

    return (
        <div>
            {renderTodos}
        </div>
    )
}

export default Todo
