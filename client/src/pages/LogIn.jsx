import { useState } from 'react'
import { useAuth } from '@/hooks'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { InputField } from '@/components'

const LogIn = () => {
    const initialState = { username: '', password: '' }
    const { logIn, loading } = useAuth()
    const [loginData, setLoginData] = useState(initialState)

    const handleChange = (e) => {
        const { name, value } = e.target
        setLoginData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await logIn(loginData)
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <main className="flex h-screen items-center justify-center">
            <div className="z-50 flex overflow-hidden rounded-lg bg-gray-300">
                <div className="flex w-full min-w-80 items-center justify-center bg-gray-100 sm:min-w-96">
                    <div className="w-full max-w-md p-6">
                        <h1 className="mb-6 text-center text-3xl font-semibold text-black">Login</h1>
                        <h1 className="mb-6 text-center text-sm font-semibold text-gray-500">
                            Welcome back! Log in to your account
                        </h1>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <InputField
                                label="Username"
                                id="username"
                                name="username"
                                value={loginData.username}
                                onChange={handleChange}
                            />

                            <InputField
                                label="Password"
                                id="password"
                                name="password"
                                type="password"
                                value={loginData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="submit"
                                className="w-full rounded-md bg-black p-2 text-white transition-colors duration-300 hover:bg-gray-800 focus:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={loading}
                            >
                                Login
                            </button>
                        </form>
                        <div className="mt-4 text-center text-sm text-gray-600">
                            <p>
                                Don&apos;t have an account?{' '}
                                <Link to="/signup" className="text-black hover:underline">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
export default LogIn
