import { Header } from './components'
import { useQuery } from '@apollo/client'
import { GET_AUTHENTICATED_USER } from './graphql/queries/user.query'
import { Toaster } from 'react-hot-toast'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Home, Login, SignUp, Transaction, NotFound } from './pages'

const App = () => {
    const { loading, data, error } = useQuery(GET_AUTHENTICATED_USER)

    if (loading) return null
    console.log('Auth User Data:', data?.authUser)

    return (
        <>
            {data?.authUser && <Header />}
            <Routes>
                <Route path="/" element={data.authUser ? <Home /> : <Navigate to="/login" />} />
                <Route path="/login" element={!data.authUser ? <Login /> : <Navigate to="/" />} />
                <Route path="/signup" element={!data.authUser ? <SignUp /> : <Navigate to="/" />} />
                <Route path="/transaction/:id" element={data.authUser ? <Transaction /> : <Navigate to="/login" />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
        </>
    )
}

export default App
