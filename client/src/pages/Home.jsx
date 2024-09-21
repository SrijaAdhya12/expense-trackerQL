import { MdLogout } from 'react-icons/md'
import { Doughnut } from 'react-chartjs-2'
import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { TransactionForm, Cards } from '@/components'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { GET_TRANSACTION_STATISTICS } from '@/graphql/queries/transaction.query'
import { useAuth } from '@/hooks'

ChartJS.register(ArcElement, Tooltip, Legend)

const Home = () => {
    const { data } = useQuery(GET_TRANSACTION_STATISTICS)
    const { user, logOut: handleLogout } = useAuth()
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
                <p className="md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
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
