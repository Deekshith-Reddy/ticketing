import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, Form, Button, Alert, Dropdown } from 'react-bootstrap'
import { db } from '../firebase'
import { addDoc, collection, serverTimestamp } from "firebase/firestore"

export default function SubmitTicket() {

    const emailRef = useRef()
    const titleRef = useRef()
    const descriptionRef = useRef()
    const { currentUser } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [ticketId, setTicketId] = useState("")



    async function handleSubmit(e) {

        e.preventDefault()


        try {
            setError('')
            setLoading(true)

            console.log(emailRef.current.value)

            const docRef = await addDoc(collection(db, "tickets"), {
                email: emailRef.current.value,
                title: titleRef.current.value,
                description: descriptionRef.current.value,
                Timestamp: serverTimestamp(),
                StaffUserId: "",
                Status: "Not Assigned"
            })

            setTicketId(docRef.id)

        } catch (error) {
            setError("Error adding Ticket: ", error)
        }


        setLoading(false)
    }

    return (
        <>
            {!currentUser ?
                <>
                    <Card>
                        <Card.Body>
                            <h2 className='text-center mb-4'>Submit a Ticket</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {ticketId && <Alert variant='success'>Ticket Successfully Generated as {ticketId}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group id="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" required ref={emailRef}></Form.Control>
                                </Form.Group>
                                <Form.Group id="title">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" required ref={titleRef}></Form.Control>
                                </Form.Group>
                                <Form.Group id="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control type="text" required ref={descriptionRef}></Form.Control>
                                </Form.Group>
                                <Button disabled={loading} className='w-100 mt-3' type='submit'>Submit</Button>

                            </Form>
                        </Card.Body>
                    </Card>
                </> :
                <><p>This location is for users to submit tickets</p></>}
        </>
    )
}
