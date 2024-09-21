import React, { useState, useEffect } from 'react'
import { AuthContext } from '@/contexts'
import { useMutation } from '@apollo/client'
import { LOG_IN, SIGN_UP } from '@/graphql/mutations/user.mutation'
import toast from 'react-hot-toast'

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [logInMutation] = useMutation(LOG_IN)
    const [signUpMutation] = useMutation(SIGN_UP)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        if (storedUser && token) {
            setUser(JSON.parse(storedUser))
            setIsAuthenticated(true)
        } else {
            setUser(null)
            setIsAuthenticated(false)
        }
    }, [])

    const logIn = async (userData) => {
        try {
            setLoading(true)
            const {
                data: {
                    logIn: { token, user }
                }
            } = await logInMutation({ variables: { input: userData } })
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('token', token)
            setUser(user)
            setIsAuthenticated(true)
            toast.success('Successfully Logged In')
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const signUp = async (userData) => {
        try {
            setLoading(true)
            const {
                data: {
                    signUp: { token, user }
                },
            } = await signUpMutation({ variables: { input: userData } })
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('token', token)
            setUser(user)
            setIsAuthenticated(true)
            toast.success('Signup successful')
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const logOut = () => {
        try {
            setLoading(true)
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            setUser(null)
            setIsAuthenticated(false)
            toast.success('Logout successful')
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, logIn, logOut, signUp, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
