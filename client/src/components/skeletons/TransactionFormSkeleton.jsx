const TransactionFormSkeleton = () => {
    return (
        <div className="h-screen max-w-xl mx-auto py-10">
            <h3 className="h-6 bg-gray-200 rounded animate-pulse" />

            <ul className="mt-5 flex gap-3">
                <li className="w-full h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse" />
                <li className="w-full h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse" />
                <li className="w-full h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse" />
            </ul>
            <ul className="mt-5 flex gap-3">
                <li className="w-full h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse" />
                <li className="w-full h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse" />
            </ul>
            <ul className="mt-5 flex gap-3">
                <li className="w-full h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse" />
            </ul>
        </div>
    )
}
export default TransactionFormSkeleton
