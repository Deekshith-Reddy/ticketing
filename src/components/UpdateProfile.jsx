import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function UpdateProfile() {

    const { currentUser } = useAuth()

    return (
        <>
            {currentUser ?
                <>"This"</>
                :
                <>
                    <p>Currently Not Logged In.</p>
                    <Link to='/login' className='btn btn-primary w-100 mt-3'>Log In</Link>
                    <Link to='/signup' className='btn btn-primary w-100 mt-3'>Sign Up</Link>
                </>}
        </>
    )
}
