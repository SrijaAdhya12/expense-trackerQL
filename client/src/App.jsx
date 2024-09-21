import Header from '@/components/ui/Header'
import GridBackground from '@/components/ui/GridBackground'
import { Loader, AppRouter } from '@/components'
import { GET_AUTHENTICATED_USER } from '@/graphql/queries/user.query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, NetworkStatus } from '@apollo/client'

const ExpenseTrackerQL = () => {
    const { loading, data, error, networkStatus } = useQuery(GET_AUTHENTICATED_USER)
    console.log(NetworkStatus, networkStatus)

    if (loading) {
        return <Loader />
    }

    if (error) {
        return console.error(error)
    }

    return (
        <>
            {data?.authUser && <Header />}
            <AppRouter />
            <Toaster />
        </>
    )
}

const App = () => {
    const client = new ApolloClient({
        uri: import.meta.env.VITE_API,
        cache: new InMemoryCache(),
        credentials: 'include'
    })
    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <GridBackground>
                    <ExpenseTrackerQL />
                </GridBackground>
            </BrowserRouter>
        </ApolloProvider>
    )
}

export default App
