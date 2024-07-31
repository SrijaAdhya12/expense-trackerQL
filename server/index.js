import express from 'express'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'

import passport from 'passport'
import session from 'express-session'
import connectMongo from 'connect-mongodb-session'

import { buildContext } from 'graphql-passport'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import mergedResolvers from './resolvers/index.js'
import mergedTypeDefs from './typeDefs/index.js'
import { connectDB } from './db/connectDB.js'
import { configurePassport } from './passport/passport.js'
import path from 'path'

dotenv.config()
configurePassport()

const __dirname = path.resolve()

const app = express()
const httpServer = http.createServer(app)

const MongoDBstore = connectMongo(session)
const store = new MongoDBstore({
    uri: process.env.MONGO_URI,
    collection: 'session'
})

store.on('error', (err) => console.log(err))

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true
        },
        store: store
    }),
    passport.initialize(),
    passport.session()
)

const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})

// Ensure we wait for our server to start
await server.start()

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

app.use(express.static(path.join(__dirname, "client/dist")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname , "client/dist" , "index.html"))
})

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: process.env.PORT }, resolve))
await connectDB()

console.log(`🚀 Server ready at port ${process.env.PORT}`)
