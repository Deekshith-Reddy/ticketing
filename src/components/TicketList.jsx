import React from 'react'
import { Link } from 'react-router-dom'

export default function TicketList({ tickets, title, loading }) {


    const formatTimestamp = (timestamp) => {
        const dateObject = timestamp.toDate()
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return dateObject.toLocaleDateString('en-US', options);
    }

    return (
        <> {loading ?
            <>
                Loading...
            </> :

            <div className='col'>
                <h2 className='text-center mt-4'>{title}</h2>
                {tickets.map((ticket) => (
                    <div key={ticket.id} className='row border p-3'>
                        Id:<Link to={`/ticket-viewer/${ticket.id}`} className='col-sm'> {ticket.id} </Link>
                        <p className='col-sm'>Email: {ticket.email}</p>
                        <p className='col-sm'>Title: {ticket.title}</p>
                        <p className='col-sm'>Created At: {formatTimestamp(ticket.timestamp)}</p>
                        <p className="col-sm">Status: {ticket.status}</p>
                    </div>
                ))}
            </div>
        }
        </>
    )
}
