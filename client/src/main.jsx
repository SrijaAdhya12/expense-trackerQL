import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { GridBackground } from './components'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

const client = new ApolloClient({
    uri: import.meta.env.VITE_SERVER,
    cache: new InMemoryCache(),
    credentials: 'include'
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <GridBackground>
                <ApolloProvider client={client}>
                    <App />
                </ApolloProvider>
            </GridBackground>
        </BrowserRouter>
    </StrictMode>
)
