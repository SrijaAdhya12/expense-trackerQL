import express from 'express'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import passport from 'passport'
import session from 'express-session'
import connectMongo from 'connect-mongodb-session'
import mergedResolvers from './resolvers/index.js'
import mergedTypeDefs from './typeDefs/index.js'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { buildContext } from 'graphql-passport'
import { connectDB } from './db/connectDB.js'
import { configurePassport } from './passport/index.js'

configurePassport()
dotenv.config()

const app = express()
const MongoDBStore = connectMongo(session)
const httpServer = http.createServer(app)
const PORT = process.env.PORT
const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers
})
app.use(
    session({
        name: 'cookie',
        secret: process.env.SESSION_SECRET,
        resave: false, // this option specifies whether to save the session to the store on every request
        saveUninitialized: false, // option specifies whether to save uninitialized sessions
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            // httpOnly: true // this option prevents the Cross-Site Scripting (XSS) attacks
        },
        store: new MongoDBStore({
            uri: process.env.MONGO_URI,
            collection: 'sessions'
        })
    }),
    passport.initialize(),
    passport.session()
)
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
}


// Ensure we wait for our server to start
await server.start()

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
    '/graphql',
    cors({
        origin: [process.env.PRODUCTION_URL, 'http://localhost:5173'],
        credentials: true
    }),
    express.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
        context: async ({ req, res }) => buildContext({ req, res })
    })
)

// npm run build will build your frontend app, and it will the optimized version of your app

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve))
await connectDB()
console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
