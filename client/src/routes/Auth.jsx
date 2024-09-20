import { Navigate } from 'react-router-dom'
import { GET_AUTHENTICATED_USER } from '../graphql/queries/user.query'
import { useQuery } from '@apollo/client'

const Auth = ({ component }) => {
    const {
        data: { authUser }
    } = useQuery(GET_AUTHENTICATED_USER)
    return authUser ? <Navigate to="/" /> : component
}

export default Auth
