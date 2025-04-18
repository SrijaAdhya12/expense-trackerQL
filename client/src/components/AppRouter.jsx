import { AuthRoute, PrivateRoute } from '@/routes'
import { Routes, Route, useLocation } from 'react-router'
import { Home, LogIn, SignUp, Transaction, NotFound } from '@/pages'

const AppRouter = () => {
    const location = useLocation()
    return (
        <Routes location={location}>
            <Route path="/" element={<PrivateRoute component={<Home />} />} />
            <Route path="/transaction/:id" element={<PrivateRoute component={<Transaction />} />} />
            <Route path="/login" element={<AuthRoute component={<LogIn />} />} />
            <Route path="/signup" element={<AuthRoute component={<SignUp />} />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default AppRouter
