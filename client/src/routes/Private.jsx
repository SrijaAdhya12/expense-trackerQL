import { Navigate } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_AUTHENTICATED_USER } from '../graphql/queries/user.query'

const Private = ({ component }) => {
    const {
        loading,
        data: { authUser },
        error
    } = useQuery(GET_AUTHENTICATED_USER)

    return authUser ? component : <Navigate to="/login" />
}

export default Private
