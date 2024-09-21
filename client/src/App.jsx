import { AppRouter } from './components'
import Header from './components/ui/Header'
import GridBackground from './components/ui/GridBackground'
import { GET_AUTHENTICATED_USER } from './graphql/queries/user.query'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery } from '@apollo/client'

const ExpenseTrackerQL = () => {
    const { loading, data, error } = useQuery(GET_AUTHENTICATED_USER)
    if (error) {
        return error && console.error(error)
    }
    console.log("loading", loading)
    console.log(data)
    return (
        !loading && (
            <GridBackground>
                {data?.authUser && <Header />}
                <AppRouter />
                <Toaster />
            </GridBackground>
        )
    )
}

const App = () => {
    const client = new ApolloClient({
        uri: import.meta.env.VITE_API,
        cache: new InMemoryCache(),
        credentials: 'include'
    })
    return (
        <BrowserRouter>
            <ApolloProvider client={client}>
                <ExpenseTrackerQL />
            </ApolloProvider>
        </BrowserRouter>
    )
}

export default App
