import React, { useContext, useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import { setDoc, doc } from 'firebase/firestore'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {

            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        return signOut(auth)
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
    }

    async function addUser(userId, email) {
        const data = {
            userId: userId,
            email: email,
            role: '',
            firstName: '',
            lastName: ''
        }

        return await setDoc(doc(db, "users", userId), data)

    }

    const value = {
        currentUser,
        login,
        logout,
        signup,
        resetPassword,
        addUser
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
