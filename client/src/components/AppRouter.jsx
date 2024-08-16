import { Routes, Route, useLocation } from 'react-router-dom'
import { Home, Login, SignUp, Transaction, NotFound } from '../pages'
import { AuthRoute, PrivateRoute } from '../routes'

const AppRouter = () => {
    const location = useLocation()
    return (
        <Routes location={location}>
            <Route path="/" element={<PrivateRoute component={<Home />} />} />
            <Route path="/transaction/:id" element={<PrivateRoute component={<Transaction />} />} />
            <Route path="/login" element={<AuthRoute component={<Login />} />} />
            <Route path="/signup" element={<AuthRoute component={<SignUp />} />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default AppRouter
