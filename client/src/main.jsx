import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { GridBackground } from './components'
import { BrowserRouter } from 'react-router-dom'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

import App from './App'
import './index.css'

const client = new ApolloClient({
    uri: import.meta.env.VITE_API,
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
