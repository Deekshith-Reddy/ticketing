import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { onSnapshot, doc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function TicketViewer() {

    const { id } = useParams()
    const [ticketData, setTicketData] = useState({})
    const [created, setCreated] = useState('')
    const [loading, setLoading] = useState(false)
    const { currentUser } = useAuth()

    useEffect(() => {

        setLoading(true)
        const unsubscribe = onSnapshot(doc(db, "tickets", id), (doc) => {

            const data = {
                id: doc.id,
                email: doc.data().email,
                title: doc.data().title,
                description: doc.data().description,

                status: doc.data().Status,
                userId: doc.data().StaffUserId
            }

            setCreated(formatTimestamp(doc.data().Timestamp,))

            setTicketData(data)

        })


        setLoading(false)

        return unsubscribe
    }, [])

    const formatTimestamp = (timestamp) => {
        const dateObject = timestamp.toDate()
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return dateObject.toLocaleDateString('en-US', options);
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
                {!loading && ticketData && <div className='mt-5'>
                    TicketViewer @ {id}
                    {/* {console.log(ticketData)} */}
                    <div key={ticketData.id} className='border p-3'>
                        <p className='col-sm'>Id: {ticketData.id} </p>
                        <p className='col-sm'>Email: {ticketData.email}</p>
                        <p className='col-sm'>Title: {ticketData.title}</p>
                        <p className='col-sm'>Description: {ticketData.description}</p>
                        <p className='col-sm'>Status: {ticketData.status}</p>
                        <p className='col-sm'>Assigned To: {ticketData.userId ? ticketData.userId : 'NA'}</p>

                        {created && <p className='col-sm'>Created At: {created}</p>}

                    </div>

                </div>}

            </>
        }

        </>

    )
}
