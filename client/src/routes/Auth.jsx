import { Navigate } from 'react-router-dom'
import { GET_AUTHENTICATED_USER } from '../graphql/queries/user.query'
import { useQuery } from '@apollo/client'
import { Loader } from '@/components'

const Auth = ({ component }) => {
    const {
        data: { authUser },
        loading
    } = useQuery(GET_AUTHENTICATED_USER)

    if (loading) {
        return <Loader />
    }

    return authUser ? <Navigate to="/" /> : component
}

export default Auth
