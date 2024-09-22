import { MdLogout } from 'react-icons/md'
import { Doughnut } from 'react-chartjs-2'
import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { TransactionForm, Cards } from '@/components'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { GET_TRANSACTION_STATISTICS } from '@/graphql/queries/transaction.query'
import { useAuth } from '@/hooks'
import toast from 'react-hot-toast'

ChartJS.register(ArcElement, Tooltip, Legend)

const ErrorToast = ({ message, toast, callback }) => {
    const toastDismiss = (toast) => {
        callback()
        toast.dismiss()
    }
    return (
        <span className="flex gap-2">
            {message}
            <button className="ring-1 rounded-sm bg-red-500 text-white p-2" onClick={() => toastDismiss(toast)}>
                Logout
            </button>
        </span>
    )
}

const Home = () => {
    const { user, logOut: handleLogout } = useAuth()

    const { data } = useQuery(GET_TRANSACTION_STATISTICS, {
        onError: (error) => {
            error = JSON.parse(error.message)
            if (error.code === 'JWT_ERROR') {
                toast.error(() => (
                    <ErrorToast
                        message={`${error.message}. Please Log out and try signing in again.`}
                        toast={toast}
                        callback={handleLogout}
                    />
                ))
                return
            }
            toast.error(error.message)
        }
    })

    const [chartData, setChartData] = useState({
        labels: [],

        datasets: [
            {
                label: '$',
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
                borderRadius: 30,
                spacing: 10,
                cutout: 130
            }
        ]
    })

    useEffect(() => {
        if (data?.categoryStatistics) {
            const categories = data.categoryStatistics.map((stat) => stat.category)
            const totalAmounts = data.categoryStatistics.map((stat) => stat.totalAmount)
            const backgroundColors = []
            const borderColors = []
            categories.forEach((category) => {
                if (category === 'saving') {
                    backgroundColors.push('rgba(75, 192, 192)')
                    borderColors.push('rgba(75, 192, 192)')
                } else if (category === 'expense') {
                    backgroundColors.push('rgba(255, 99, 132)')
                    borderColors.push('rgba(255, 99, 132)')
                } else if (category === 'investment') {
                    backgroundColors.push('rgba(54, 162, 235)')
                    borderColors.push('rgba(54, 162, 235)')
                } else if (category === 'miscellaneous') {
                    backgroundColors.push('rgb(250, 204, 21)')
                    borderColors.push('rgb(250, 204, 21)')
                }
            })

            setChartData((prev) => ({
                labels: categories,
                datasets: [
                    {
                        ...prev.datasets[0],
                        data: totalAmounts,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors
                    }
                ]
            }))
        }
    }, [data])
    return (
        <main className="flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center">
            <div className="flex items-center">
                <p className="md:text-4xl text-2xl lg:text-4xl font-bold text-center  relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
                    Spend wisely, track wisely
                </p>
                <img src={user.profilePicture} className="w-11 h-11 rounded-full border cursor-pointer" alt="Avatar" />
                <MdLogout className="mx-2 w-5 h-5 cursor-pointer" onClick={handleLogout} />
            </div>
            <div className="flex flex-wrap w-full justify-center items-center gap-6 ">
                {data?.categoryStatistics.length > 0 && (
                    <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]  ">
                        <Doughnut data={chartData} />
                    </div>
                )}
                <TransactionForm />
            </div>
            <Cards />
        </main>
    )
}
export default Home
