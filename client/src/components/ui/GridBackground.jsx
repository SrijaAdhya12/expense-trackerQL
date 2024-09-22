const GridBackground = ({ children }) => {
    return (
        <div className="bg-grid-white/[0.2] relative flex min-h-screen w-full flex-col items-center justify-center bg-black text-white">
            <div className="pointer-events-none absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            {children}
        </div>
    )
}
export default GridBackground
