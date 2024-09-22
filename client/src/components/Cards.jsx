import Card from './Card'
import { useQuery } from '@apollo/client'
import { GET_TRANSACTIONS } from '@/graphql/queries/transaction.query'
import { useAuth } from '@/hooks'
import { useMemo, useState } from 'react'
import { Loader } from '@/components'
import { FaSortAlphaDown, FaSortAlphaUp, FaSortNumericDown, FaSortNumericUp, FaUndo } from 'react-icons/fa'

const Cards = () => {
    const [isSearching, setIsSearching] = useState(false)

    const searchDelay = () => new Promise((resolve) => setTimeout(resolve, 1000))

    const { data, loading } = useQuery(GET_TRANSACTIONS)
    const { user } = useAuth()
    const [sortBy, setSortBy] = useState('date')
    const [sortOrder, setSortOrder] = useState('desc')
    const [searchTerm, setSearchTerm] = useState('')

    const sortedAndFilteredTransactions = useMemo(() => {
        if (loading) {
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
                    return sortOrder === 'desc' ? b.date - a.date : a.date - b.date
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
        <div className="max-w-48 sm:w-full sm:max-w-full sm:px-10">
            <div className="my-2 flex flex-col items-center sm:flex-row sm:justify-between">
                <p className="my-10 text-center text-3xl font-bold sm:flex-initial sm:text-5xl">History</p>
                <div className="flex items-center justify-center gap-1">
                    <div className="mx-auto">
                        <label
                            className="mb-2 hidden text-xs font-bold uppercase tracking-wide text-white sm:block"
                            htmlFor="description"
                        >
                            Search
                        </label>
                        <input
                            className="block h-10 w-[200px] appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none sm:w-80"
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
                        className="mt-5 flex size-10 items-center justify-center rounded-md *:size-5"
                    >
                        {sortBy === 'date' && sortOrder === 'asc' ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
                    </button>
                    <button
                        onClick={() => handleSort('amount')}
                        className="mt-5 flex size-10 items-center justify-center rounded-md *:size-5"
                    >
                        {sortBy === 'amount' && sortOrder === 'asc' ? <FaSortNumericDown /> : <FaSortNumericUp />}
                    </button>
                    <button
                        onClick={handleReset}
                        className="mt-5 flex size-10 items-center justify-center rounded-md *:size-5"
                    >
                        <FaUndo />
                    </button>
                </div>
            </div>
            <div className="mx-[-70px] mb-20 grid min-w-max flex-1 grid-cols-1 justify-start gap-4 sm:mx-0 md:w-6 md:grid-cols-2 lg:grid-cols-3">
                {isSearching || loading ? (
                    <div className="col-span-3 flex min-h-96 items-center justify-center">
                        <Loader />
                    </div>
                ) : sortedAndFilteredTransactions.length ? (
                    sortedAndFilteredTransactions.map((transaction) => (
                        <Card key={transaction._id} transaction={transaction} authUser={user} />
                    ))
                ) : (
                    <div className="col-span-3 row-span-3 flex min-h-96 items-center justify-center">
                        <p className="w-full text-center text-xl font-bold sm:text-2xl">
                            No transaction history found.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
export default Cards
