import Header from '@/components/ui/Header'
import GridBackground from '@/components/ui/GridBackground'
import { AppRouter } from '@/components'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/providers'
import { BrowserRouter } from 'react-router-dom'
import { setContext } from '@apollo/client/link/context'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'

const ExpenseTrackerQL = () => {
    return (
        <>
            <Header />
            <AppRouter />
            <Toaster position="top-right" />
        </>
    )
}

const App = () => {
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
