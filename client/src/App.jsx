import { Header } from './components'
import { useQuery } from '@apollo/client'
import { GET_AUTHENTICATED_USER } from './graphql/queries/user.query'
import { Toaster } from 'react-hot-toast'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Home, Login, SignUp, Transaction, NotFound } from './pages'

const App = () => {
    const authUser = true
    const { loading, data, error } = useQuery(GET_AUTHENTICATED_USER)
    console.log(data)
    console.log(loading)
    console.log(error)
    return (
        <>
            {data?.authUser && <Header />}
            <Routes>
                <Route path="/" element={ <Home />} />
                <Route path="/login" element={<Login /> } />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/transaction/:id" element={<Transaction />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
        </>
    )
}

export default App
