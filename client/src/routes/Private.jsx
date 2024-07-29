import { Navigate } from 'react-router-dom'
// import { GET_AUTHENTICATED_USER } from '../graphql/queries/user.query'

const Private = ({ component }) => {
    return data.authUser ? component:  <Navigate to="/login" />
}

export default Private
