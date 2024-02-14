import React, { useEffect, useState } from 'react'

const User = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const usersData = await res.json()
      setUsers(usersData)
    }
    fetchUsers()
  }, [])

  const renderUsers = users.map((user) => {
    return (
      <div key={user.id}>
        <p>
          <strong>{user.name}</strong>
        </p>
      </div>
    )
  })

  return (
    <div>
      {renderUsers}
    </div>
  )
}

export default User
