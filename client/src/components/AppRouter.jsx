import { Routes, Route } from "react-router-dom"
import { Home, Login, SignUp, Transaction, NotFound } from "../pages"
import { useQuery } from '@apollo/client'
import {GET_AUTHENTICATED_USER} from "../graphql/queries/user.query"

const AppRouter = () => {
}

export default AppRouter