

const LoadingElement = () => {
    return (
        <div className="text-lg font-medium text-gray-800">
            Loading
            <span className="inline-flex ml-1">
                <span className="animate-pulse">.</span>
                <span className="animate-pulse [animation-delay:200ms]">.</span>
                <span className="animate-pulse [animation-delay:400ms]">.</span>
            </span>
        </div>
    )
}

export default LoadingElement