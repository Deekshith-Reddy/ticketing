import React, { useEffect, useState } from 'react'
import { Card, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import TicketList from './TicketList'

export default function Dashboard() {

    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(false)
    const [assignedTickets, setAssignedTickets] = useState([])
    const navigate = useNavigate()

    const filterTickets = (data) => {
        //console.log(currentUser.uid === data[0].userId)
        const temp = data.filter((item) => {
            return currentUser.uid === item.userId
        })
        return temp
    }

    useEffect(() => {
        setLoading(true)
        const unsubscribe = onSnapshot(collection(db, "tickets"), (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                email: doc.data().email,
                title: doc.data().title,
                description: doc.data().description,
                timestamp: doc.data().Timestamp,
                status: doc.data().Status,
                userId: doc.data().StaffUserId
            }))
            //console.log(data)
            setTickets(data)
            setAssignedTickets(filterTickets(data))
        })
        setLoading(false)
        return unsubscribe
    }, [])

    async function handleLogout() {
        setError('')

        try {
            await logout()
            navigate("/login")

        } catch (e) {
            setError(e.message)
        }
    }



    return (
        <>
            {currentUser ?
                <>
                    <Card>
                        <Card.Body>
                            <h2 className='text-center mb-4'>Profile </h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <strong>Email: </strong>{currentUser.email}
                            <Link to='/update-profile' className='btn btn-primary w-100 mt-3'>Update Profile</Link>
                        </Card.Body>
                    </Card>
                    <div className='w-100 text-center mt-2'>
                        <Button variant='link' onClick={handleLogout}>Log Out</Button>
                    </div>
                    <div className="container temp">

                        <TicketList loading={loading} tickets={assignedTickets} title={"Assigned Tickets"}></TicketList>
                        <TicketList loading={loading} tickets={tickets} title={"All Tickets"}></TicketList>

                    </div>
                </>
                : <>
                    <p>Staff? Currently Not Logged In.</p>
                    <Link to='/login' className='btn btn-primary w-100 mt-3'>Log In</Link>
                    <Link to='/signup' className='btn btn-primary w-100 mt-3'>Sign Up</Link>

                    <p>A User?</p>
                    <Link to='/submit-ticket' className='btn btn-primary w-100 mt-3'>Submit a Ticket</Link>

                </>}
        </>

    )
}
