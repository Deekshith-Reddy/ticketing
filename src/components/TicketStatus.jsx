import React, { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { useParams } from 'react-router-dom'

export default function TicketStatus() {

    const { id } = useParams()
    const [ticketData, setTicketData] = useState({})
    const [loading, setLoading] = useState('')
    const [created, setCreated] = useState('')


    useEffect(() => {

        setLoading(true)
        const unsubscribe = onSnapshot(doc(db, "tickets", id), (doc) => {
            if (typeof doc.data() === 'undefined') {
                console.log(doc.data())
                setTicketData()
                setLoading(false)
                return
            }


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
    }, [])

    const formatTimestamp = (timestamp) => {
        const dateObject = timestamp.toDate()
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return dateObject.toLocaleDateString('en-US', options);
    }


    return (
        <> {ticketData ?
            <>
                <div key={ticketData.id} className='border mt-5 p-3'>
                    <h2 className='mb-5'>Ticket Status</h2>
                    <p className='col-sm'>Id: {ticketData.id} </p>
                    <p className='col-sm'>Email: {ticketData.email}</p>
                    <p className='col-sm'>Title: {ticketData.title}</p>
                    <p className='col-sm'>Description: {ticketData.description}</p>
                    <p className='col-sm'>Status: {ticketData.Status}</p>
                    <p className='col-sm'>Assigned To: {ticketData.StaffUserId ? ticketData.StaffUserId : 'NA'}</p>

                    {created && <p className='col-sm'>Created At: {created}</p>}

                </div>
            </> :
            <>
                No data present
            </>}
        </>
    )
}
