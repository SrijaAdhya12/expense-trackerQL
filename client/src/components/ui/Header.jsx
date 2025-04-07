import { useAuth } from '@/hooks'
import { Link } from 'react-router'

const Header = () => {
    const { user } = useAuth()
    if (!user) {
        return null
    }
    return (
        <div className="mb-10">
            <h1 className="relative z-50 pt-10 text-center text-4xl font-bold text-white md:text-6xl lg:text-8xl">
                <Link to="/"> Expense TrackerQL</Link>
            </h1>
            <div className="relative mx-auto mb-10 hidden w-1/2 md:block">
                <div className="absolute inset-x-20 top-0 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm" />
                <div className="absolute inset-x-20 top-0 h-px w-3/4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                <div className="absolute inset-x-60 top-0 h-[5px] w-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent blur-sm" />
                <div className="absolute inset-x-60 top-0 h-px w-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
            </div>
        </div>
    )
}
export default Header
