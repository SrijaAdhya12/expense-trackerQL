import { cn } from '@/lib'

const Loader = ({ className }) => {
    return (
        <div className="flex justify-center items-center">
            <div
                className={cn('animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500', className)}
            />
        </div>
    )
}

export default Loader
