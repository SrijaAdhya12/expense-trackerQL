import { cn } from '@/lib'
const Loader = ({ className }) => {
    return (
        <div className="flex items-center justify-center">
            <div
                className={cn('h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-blue-500', className)}
            />
        </div>
    )
}
export default Loader
