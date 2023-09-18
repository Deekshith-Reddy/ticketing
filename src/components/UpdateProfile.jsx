import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function UpdateProfile() {

    const { currentUser } = useAuth()
    const navigate = useNavigate()
    const [currentUserData, setCurrentUserData] = useState({})
    const [edit, setEdit] = useState(false)
    const [updateMessage, setUpdateMessage] = useState()
    const [buttonText, setButtonText] = useState("Don't Edit")
    const firstNameRef = useRef()
    const lastNameRef = useRef()

    useEffect(() => {
        if (!currentUser) {
            navigate('/')
        }

        const unsubscribe = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {

            const data = {
                userId: doc.data().userId,
                role: doc.data().role,
                firstName: doc.data().firstName,
                lastName: doc.data().lastName,
                email: doc.data().email
            }

            setCurrentUserData(data)
        })

        return unsubscribe

    }, [edit])

    const handleEditSubmit = async (e) => {
        e.preventDefault()

        console.log(firstNameRef.current.value, lastNameRef.current.value)

        const userData = {
            userId: currentUserData.userId,
            role: currentUserData.role,
            email: currentUserData.email,
            firstName: firstNameRef.current.value,
            lastName: lastNameRef.current.value
        }

        await setDoc(doc(db, "users", currentUserData.userId), userData)
        setUpdateMessage(`Updated Values Successfully for userId: ${currentUserData.userId}`)
        setButtonText("Go Back")

    }

    const handleSubmit = (e) => {
        e.preventDefault()

        setEdit(true)
    }

    return (
        <>
            {currentUser ?
                <><div className=''>
                    <h2 className=''>Update Profile</h2>
                    {updateMessage && <><Alert variant='success'>{updateMessage}</Alert></>}
                    {edit ?

                        < Card >
                            <Card.Body>
                                <Form onSubmit={handleEditSubmit}>
                                    <div>
                                        <label className='m-2' >User Id</label>
                                        <input type="text" disabled className="form-control" defaultValue={currentUserData.userId} />

                                    </div>
                                    <div>
                                        <label className='m-2' >Email</label>
                                        <input type="text" disabled className="form-control" defaultValue={currentUserData.email} />

                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <label className='m-2' >First Name</label>
                                            <input type="text" className="form-control" ref={firstNameRef} defaultValue={currentUserData.firstName ? currentUserData.firstName : 'NA'} />
                                        </div>
                                        <div className="col">
                                            <label className='m-2'>Last Name</label>
                                            <input type="text" className="form-control" ref={lastNameRef} defaultValue={currentUserData.lastName ? currentUserData.lastName : 'NA'} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className='m-2' >Role</label>
                                        <input type="text" disabled className="form-control" defaultValue={currentUserData.role ? currentUserData.role : 'NA'} />

                                    </div>

                                    <div className='d-flex justify-content-around'>
                                        <Button type='submit' className='mt-2'>Submit</Button>
                                        <Button onClick={(edit) => { setEdit(!edit); setUpdateMessage(''); setButtonText("Don't Edit") }} className='mt-2'>{buttonText}</Button>

                                    </div>
                                </Form>

                            </Card.Body>
                        </Card>

                        : <>
                            <Card>
                                <Card.Body>
                                    <p>Email: {currentUserData.email}</p>
                                    <p>First Name: {currentUserData.firstName}</p>
                                    <p>Last Name: {currentUserData.lastName}</p>
                                </Card.Body>

                                <Button type='submit' onClick={handleSubmit}>Click to Edit</Button>

                            </Card>
                        </>}
                </div>
                </>
                :
                <>
                    <p>Currently Not Logged In.</p>
                    <Link to='/login' className='btn btn-primary w-100 mt-3'>Log In</Link>
                    <Link to='/signup' className='btn btn-primary w-100 mt-3'>Sign Up</Link>
                </>
            }
        </>
    )
}
