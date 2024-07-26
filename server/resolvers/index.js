import { mergeResolvers } from "@graphql-tools/merge";
import userResolver from "./user.res.js";
import transactionResolver from "./transaction.res.js";

const mergedResolvers = mergeResolvers([userResolver, transactionResolver]);

export default mergedResolvers;
