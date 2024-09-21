import express from 'express'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import passport from 'passport'
import session from 'express-session'
import connectMongo from 'connect-mongodb-session'
import { buildContext } from 'graphql-passport'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { mergedResolvers } from './resolvers/index.js'
import { mergedTypeDefs } from './typeDefs/index.js'
import { configurePassport } from './passport/index.js'

configurePassport()

dotenv.config()
const PORT = process.env.PORT
const MongoDBstore = connectMongo(session)
const store = new MongoDBstore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
})

store.on('error', (err) => console.error(err))

const app = express()
const httpServer = http.createServer(app)
const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    context: ({ req, res }) => {
        return buildContext({ req, res, User })
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})

// Ensure we wait for our server to start
await server.start()
const allowedOrigin = [process.env.PRODUCTION_URL]
app.use(
    session({
        name: 'session',
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            sameSite: 'none'
        },
        store
    }),
    passport.initialize(),
    passport.session(),
    express.json(),
    cors({
        origin: allowedOrigin,
        credentials: true
    })
)
app.use(
    '/graphql',
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    }),
    express.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
        context: async ({ req, res }) => buildContext({ req, res })
    })
)
.get('/test', (_, res) => res.send('Welcome to ApolloServer'))
// .use('/graphql')

mongoose
    .connect(process.env.MONGO_URI)
    .then((result) => console.log(`MongoDB Connected 🌐 ${result.connection.host}`))
    .then(() => httpServer.listen(PORT, () => console.log(`Server running on port: ${PORT} 🚀`)))
    .catch((error) => console.log(`❎ Server did not connect ⚠️\n${error}`))
