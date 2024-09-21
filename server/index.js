import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import { ApolloServer } from '@apollo/server'
import { mergedTypeDefs } from './types/index.js'
import { mergedResolvers } from './resolvers/index.js'
import { expressMiddleware } from './middlewares/index.js'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'

dotenv.config()

const app = express()

const httpServer = http.createServer(app)
const PORT = process.env.PORT

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
