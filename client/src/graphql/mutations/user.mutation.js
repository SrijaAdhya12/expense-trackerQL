import { gql } from '@apollo/client'

export const SIGN_UP = gql`
    mutation signUp($input: SignUpInput!) {
        signUp(input: $input) {
            token
            user {
                _id
                username
                name
                profilePicture
                gender
            }
        }
    }
`

export const LOG_IN = gql`
    mutation logIn($input: LogInInput!) {
        logIn(input: $input) {
            token
            user {
                _id
                username
                name
                profilePicture
                gender
            }
        }
    }
`

export const LOG_OUT = gql`
    mutation logOut {
        logout {
            message
        }
    }
`
