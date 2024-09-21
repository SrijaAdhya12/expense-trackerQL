import Header from '@/components/ui/Header'
import GridBackground from '@/components/ui/GridBackground'
import { Loader, AppRouter } from '@/components'
import { GET_AUTHENTICATED_USER } from '@/graphql/queries/user.query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { setContext } from '@apollo/client/link/context'
import { ApolloClient, InMemoryCache, ApolloProvider,  createHttpLink } from '@apollo/client'
import { AuthProvider } from '@/providers'

const httpLink = createHttpLink({

    uri: import.meta.env.VITE_API
})

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token')
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const ExpenseTrackerQL = () => {

    return (
        <>
            <Header />
            <AppRouter />
            <Toaster position='top-right'/>
        </>
    )
}

const App = () => {
    const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
    })
    return (
        <ApolloProvider client={client}>
            <AuthProvider>
                <BrowserRouter>
                    <GridBackground>
                        <ExpenseTrackerQL />
                    </GridBackground>
                </BrowserRouter>
            </AuthProvider>
        </ApolloProvider>
    )
}

export default App
