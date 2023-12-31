import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, Navigate, useNavigate } from 'react-router-dom'

export default function Signup() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup, currentUser, addUser } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('passwords do not match')
        }

        try {
            setError('')
            setLoading(true)
            const obj = await signup(emailRef.current.value, passwordRef.current.value)
            console.log(obj.user.uid, obj.user.email)
            await addUser(obj.user.uid, obj.user.email)
            navigate("/")
        } catch (e) {
            setError(e.message)
        }

        setLoading(false)
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className='text-center mb-2'>Sign Up</h2>
                    {currentUser && currentUser.email}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" required ref={emailRef}></Form.Control>
                        </Form.Group>

                        <Form.Group id="password" className='mt-2'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" required ref={passwordRef}></Form.Control>
                        </Form.Group>

                        <Form.Group id="password-confirm" className='mt-2'>
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" required ref={passwordConfirmRef}></Form.Control>
                        </Form.Group>

                        <Button disabled={loading} className='w-100 mt-3' type='submit'>Sign Up</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className='w-100 text-center mt-2'>
                Already have an account? <Link to='/login'>Log In</Link>
            </div>
        </>
    )
}
