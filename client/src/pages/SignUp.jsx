import { useState } from 'react'
import { useAuth } from '@/hooks'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { RadioButton, InputField } from '@/components'

const SignUp = () => {
    const initialState = { name: '', username: '', password: '', gender: '' }
    const { signUp, loading } = useAuth()
    const [signUpData, setSignUpData] = useState(initialState)

    const handleChange = (e) => {
        const { name, value, type } = e.target

        if (type === 'radio') {
            setSignUpData((prevData) => ({
                ...prevData,
                gender: value
            }))
        } else {
            setSignUpData((prevData) => ({
                ...prevData,
                [name]: value
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await signUp(signUpData)
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <main className="flex h-screen items-center justify-center">
            <div className="z-50 flex overflow-hidden rounded-lg bg-gray-300">
                <div className="flex w-full min-w-80 items-center justify-center bg-gray-100 sm:min-w-96">
                    <div className="w-full max-w-md p-6">
                        <h1 className="mb-6 text-center text-3xl font-semibold text-black">Sign Up</h1>
                        <h1 className="mb-6 text-center text-sm font-semibold text-gray-500">
                            Join to keep track of your expenses
                        </h1>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <InputField
                                label="Full Name"
                                id="name"
                                name="name"
                                value={signUpData.name}
                                onChange={handleChange}
                                required
                            />
                            <InputField
                                label="Username"
                                id="username"
                                name="username"
                                value={signUpData.username}
                                onChange={handleChange}
                            />

                            <InputField
                                label="Password"
                                id="password"
                                name="password"
                                type="password"
                                value={signUpData.password}
                                onChange={handleChange}
                            />
                            <div className="flex gap-10">
                                <RadioButton
                                    id="male"
                                    label="Male"
                                    name="gender"
                                    value="male"
                                    onChange={handleChange}
                                    checked={signUpData.gender === 'male'}
                                />
                                <RadioButton
                                    id="female"
                                    label="Female"
                                    name="gender"
                                    value="female"
                                    onChange={handleChange}
                                    checked={signUpData.gender === 'female'}
                                />
                            </div>

                            <button
                                type="submit"
                                className="disabled={loading} w-full rounded-md bg-black p-2 text-white transition-colors duration-300 hover:bg-gray-800 focus:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'loading...' : 'Sign Up'}
                            </button>
                        </form>
                        <div className="mt-4 text-center text-sm text-gray-600">
                            <p>
                                Already have an account?{' '}
                                <Link to="/login" className="text-black hover:underline">
                                    Login
                                </Link>{' '}
                                here
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default SignUp
