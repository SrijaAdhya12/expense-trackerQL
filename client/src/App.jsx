import { AppRouter, GridBackground, Header } from './components'
import { useQuery } from '@apollo/client'
import { GET_AUTHENTICATED_USER } from './graphql/queries/user.query'
import { Toaster } from 'react-hot-toast'

const App = () => {
    const { loading, data, error } = useQuery(GET_AUTHENTICATED_USER)

    if (!data || error) {
        return null
    }

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

export default App
