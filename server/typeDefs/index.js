import { mergeTypeDefs } from '@graphql-tools/merge'

import userTypeDef from './user.js'
import transactionTypeDef from './transaction.js'

const mergedTypeDefs = mergeTypeDefs([userTypeDef, transactionTypeDef])

export default mergedTypeDefs
