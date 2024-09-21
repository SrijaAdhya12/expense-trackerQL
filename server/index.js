import http from 'http'
import cors from 'cors'
import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { Users } from './models/index.js'
import { ApolloServer } from '@apollo/server'
import { mergedTypeDefs } from './typeDefs/index.js'
import { mergedResolvers } from './resolvers/index.js'
import { expressMiddleware } from './middlewares/index.js'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

const httpServer = http.createServer(app)
const PORT = process.env.PORT || 5000

const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})
server.graphqlPath = '/graphql'

app.use('/graphql', cors(), express.json())

async function startServer() {
    await server.start()
    app.use(expressMiddleware(server))
    mongoose
        .set('strictQuery', false)
        .connect(process.env.MONGO_URI)
        .then(console.log('Connected to MongoDB Database 🌐'))
        .then(() =>
            app.listen(PORT, () => {
                console.log(
                    //
                    `Server running on`,
                    `http://localhost:${PORT}${server.graphqlPath}`
                )
            })
        )
        .catch((error) => console.log(`❌ Server did not connect ⚠️\n${error}`))
}

startServer()
