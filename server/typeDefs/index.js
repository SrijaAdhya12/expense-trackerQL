import { mergeTypeDefs } from '@graphql-tools/merge'
import userTypeDef from './user.js'
import transactionTypeDef from './transaction.js'

export const mergedTypeDefs = mergeTypeDefs([userTypeDef, transactionTypeDef])

export default mergedTypeDefs
