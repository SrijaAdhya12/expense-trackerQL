import { Navigate } from "react-router-dom";
// import { GET_AUTHENTICATED_USER } from './graphql/queries/user.query'


const Auth = ({component}) => {
    return data.authUser ? <Navigate to="/home" /> : component
  
}

export default Auth
