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

dotenv.config()

const PORT = process.env.PORT
configurePassport()
const app = express()
const httpServer = http.createServer(app)

const MongoDBstore = connectMongo(session)
const store = new MongoDBstore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
})

store.on('error', (err) => console.error(err))

app.use(
    session({
                secret: process.env.SECRET,
                resave: false,
                saveUninitialized: true,
                cookie: {
                     secure: false,
                     maxAge: 1000 * 60 * 60 * 24 * 7
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
const whitelist = ['http://localhost:5173', process.env.PRODUCTION_URL]
app.use(
    cors({
        origin: (origin, callback) => {
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
        credentials: true
    }),
    express.json(),
    expressMiddleware(server, {
        context: async ({ req, res }) => buildContext({ req, res })
    })
)
app.get('/test', (_, res) => res.send('Welcome to ApolloServer'))
mongoose
    .connect(process.env.MONGO_URI)
    .then((result) => console.log(`MongoDB Connected 🌐 ${result.connection.host}`))
    .then(() => httpServer.listen(PORT, () => console.log(`Server running on port: ${PORT} 🚀`)))
    .catch((error) => console.log(`❎ Server did not connect ⚠️\n${error}`))
