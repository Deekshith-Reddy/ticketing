import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { onSnapshot, doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'


export default function TicketViewer() {

    const { id } = useParams()
    const [ticketData, setTicketData] = useState({})
    const [created, setCreated] = useState('')
    const [loading, setLoading] = useState(false)
    const { currentUser } = useAuth()
    const currentStatusValue = useRef()
    const [updateMessage, setUpdateMessage] = useState('')
    const navigate = useNavigate()

    useEffect(() => {

        if (!currentUser) {
            navigate('/')
        }

        setLoading(true)
        const unsubscribe = onSnapshot(doc(db, "tickets", id), (doc) => {

            const data = {
                id: doc.id,
                email: doc.data().email,
                title: doc.data().title,
                description: doc.data().description,
                Timestamp: doc.data().Timestamp,
                Status: doc.data().Status,
                StaffUserId: doc.data().StaffUserId
            }

            setCreated(formatTimestamp(doc.data().Timestamp,))

            setTicketData(data)



        })

        setLoading(false)

        return unsubscribe
    }, [updateMessage])

    const formatTimestamp = (timestamp) => {
        const dateObject = timestamp.toDate()
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return dateObject.toLocaleDateString('en-US', options);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()



        console.log(ticketData.id)

        const updatedData = ticketData.StaffUserId === '' ? {
            ...ticketData,
            Status: currentStatusValue.current.value,
            StaffUserId: currentUser.uid
        } : {
            ...ticketData,
            Status: currentStatusValue.current.value
        }
        await setDoc(doc(db, "tickets", ticketData.id), updatedData)

        setUpdateMessage(`Successfully updated Ticket Id: ${ticketData.id}'s Status to ${currentStatusValue.current.value}`)

    }

    return (
        <> {!currentUser ?
            <>
                <p>Staff? Currently Not Logged In.</p>
                <Link to='/login' className='btn btn-primary w-100 mt-3'>Log In</Link>
                <Link to='/signup' className='btn btn-primary w-100 mt-3'>Sign Up</Link>

                <p>A User?</p>
                <Link to='/submit-ticket' className='btn btn-primary w-100 mt-3'>Submit a Ticket</Link>
            </> :
            <>

                {(currentUser.uid === ticketData.StaffUserId || ticketData.StaffUserId === '') ?
                    <>
                        {!loading && ticketData && <div className='mt-5'>
                            TicketViewer @ {id}

                            {updateMessage && <><Alert variant='success'>{updateMessage}</Alert></>}
                            <div key={ticketData.id} className='border p-3'>
                                <p className='col-sm'>Id: {ticketData.id} </p>
                                <p className='col-sm'>Email: {ticketData.email}</p>
                                <p className='col-sm'>Title: {ticketData.title}</p>
                                <p className='col-sm'>Description: {ticketData.description}</p>
                                {/* <p className='col-sm'>Status: {ticketData.status}</p> Modifiable */}
                                <Form onSubmit={handleSubmit}>
                                    <label htmlFor="Status">Status: </label>
                                    <select className='mr-3' name="name" id="id" ref={currentStatusValue}>
                                        <option key={1} value="Assigned">Assigned</option>
                                        <option key={2} value="In Progress">In Progress</option>
                                        <option key={3} value="Resolved">Resolved</option>
                                    </select>

                                    <Button className='m-3' type='submit'>Submit</Button>
                                </Form>
                                <p className='col-sm'>Assigned To: {ticketData.StaffUserId ? ticketData.StaffUserId : 'NA'}</p>

                                {created && <p className='col-sm'>Created At: {created}</p>}

                            </div>

                        </div>}

                    </> :
                    <>
                        {!loading && ticketData && <div className='mt-5'>
                            TicketViewer @ {id}

                            <div key={ticketData.id} className='border p-3'>
                                <p className='col-sm'>Id: {ticketData.id} </p>
                                <p className='col-sm'>Email: {ticketData.email}</p>
                                <p className='col-sm'>Title: {ticketData.title}</p>
                                <p className='col-sm'>Description: {ticketData.description}</p>
                                <p className='col-sm'>Status: {ticketData.Status}</p>
                                <p className='col-sm'>Assigned To: {ticketData.StaffUserId ? ticketData.StaffUserId : 'NA'}</p>

                                {created && <p className='col-sm'>Created At: {created}</p>}

                            </div>

                        </div>}
                    </>}

            </>
        }

        </>

    )
}
