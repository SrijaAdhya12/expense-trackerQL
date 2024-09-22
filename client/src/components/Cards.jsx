import Card from './Card'
import { useQuery } from '@apollo/client'
import { GET_TRANSACTIONS } from '@/graphql/queries/transaction.query'
import { useAuth } from '@/hooks'
import { useMemo, useState } from 'react'
import { Loader } from '@/components'
import { FaSortAlphaDown, FaSortAlphaUp, FaSortNumericDown, FaSortNumericUp, FaUndo } from 'react-icons/fa'
const Cards = () => {
    const [isSearching, setIsSearching] = useState(false)

    const searchDelay = () => {
        return new Promise((resolve) => setTimeout(resolve, 1000))
    }

    const { data } = useQuery(GET_TRANSACTIONS)
    const { user } = useAuth()
    const [sortBy, setSortBy] = useState('date')
    const [sortOrder, setSortOrder] = useState('desc')
    const [searchTerm, setSearchTerm] = useState('')

    const sortedAndFilteredTransactions = useMemo(() => {
        if (!data?.transactions) {
            return []
        }

        return data.transactions
            .filter(
                (transaction) =>
                    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    transaction.date.includes(searchTerm) ||
                    transaction.amount.toString().includes(searchTerm) ||
                    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                if (sortBy === 'date') {
                    const dateA = new Date(a.date)
                    const dateB = new Date(b.date)
                    // console.log(dateB, dateA)
                    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
                } else if (sortBy === 'amount') {
                    return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount
                }
            })
    }, [data?.transactions, sortBy, sortOrder, searchTerm])

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
        } else {
            setSortBy(field)
            setSortOrder('desc')
        }
    }

    const handleSearch = async (e) => {
        setIsSearching(true)
        setSearchTerm(e.target.value)
        await searchDelay()
        setIsSearching(false)
    }

    const handleReset = () => {
        setSortBy('date')
        setSortOrder('desc')
        setSearchTerm('')
    }
    return (
        <div className="sm:w-full sm:px-10 max-w-48 sm:max-w-full">
            <div className="flex items-center sm:justify-between sm:min-w-[1152px] flex-col sm:flex-row sm:max-w-full my-2 px-10">
                <p className="sm:text-5xl text-3xl font-bold text-center my-10 sm:ml-[-40px] sm:flex-initial">
                    History
                </p>
                <div className="items-center gap-1 justify-center flex sm:ml-[650px]">
                    <div className="mx-auto">
                        <label
                            className="sm:block uppercase tracking-wide text-white text-xs font-bold mb-2 hidden"
                            htmlFor="description"
                        >
                            Search
                        </label>
                        <input
                            className="appearance-none block bg-gray-200 h-10 w-[200px] text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 sm:w-80"
                            id="description"
                            name="description"
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <button
                        onClick={() => handleSort('date')}
                        className="size-10 mt-5 rounded-md flex items-center justify-center *:size-5"
                    >
                        {sortBy === 'date' && sortOrder === 'asc' ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
                    </button>
                    <button
                        onClick={() => handleSort('amount')}
                        className="size-10 mt-5 rounded-md flex items-center justify-center *:size-5"
                    >
                        {sortBy === 'amount' && sortOrder === 'asc' ? <FaSortNumericDown /> : <FaSortNumericUp />}
                    </button>
                    <button
                        onClick={handleReset}
                        className="size-10 mt-5 rounded-md flex items-center justify-center *:size-5"
                    >
                        <FaUndo />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mx-[-70px] sm:mx-0 mb-20 flex-1 min-w-max md: w-6">
                {isSearching ? (
                    <div className="col-span-3 min-h-96 flex items-center justify-center">
                        <Loader />
                    </div>
                ) : sortedAndFilteredTransactions.length ? (
                    sortedAndFilteredTransactions.map((transaction) => (
                        <Card key={transaction._id} transaction={transaction} authUser={user} />
                    ))
                ) : (
                    <div className="col-span-3 row-span-3 flex items-center justify-center min-h-96">
                        <p className="sm:text-2xl text-xl font-bold text-center w-full ">
                            No transaction history found.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
export default Cards
