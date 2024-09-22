import { NotFoundImg } from '@/assets/index'

const NotFound = () => {
    return (
        <main className="text-white">
            <div className="flex h-screen">
                <div className="m-auto text-center">
                    <div>
                        <img src={NotFoundImg} alt="404" />
                    </div>
                    <p className="mb-4 p-2 text-sm text-[#F6009B] md:text-base">
                        The stuff you were looking for doesn't exist
                    </p>
                    <a
                        href="/"
                        className="rounded border border-[#F6009B] bg-transparent px-4 py-2 text-[#F6009B] shadow hover:border-transparent hover:bg-[#F6009B] hover:text-white hover:shadow-lg"
                    >
                        Take me home
                    </a>
                </div>
            </div>
        </main>
    )
}
export default NotFound
