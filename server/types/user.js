const userTypeDef = `#graphql
    type User {
        _id: ID!
        username: String!
        name: String!
        password: String!
        profilePicture: String
        gender: String!
        transactions: [Transaction!]
    }
    type AuthPayload {
        token: String!
        user: User!
    }
    input SignUpInput {
        username: String!
        name: String!
        password: String!
        gender: String!
    }
    input LogInInput {
        username: String!
        password: String!
    }
    type Query {
        authUser: User
        user(userId: ID!): User
    }
    type Mutation {
        signUp(input: SignUpInput!): AuthPayload!
        logIn(input: LogInInput!): AuthPayload!
    }
`

export default userTypeDef
