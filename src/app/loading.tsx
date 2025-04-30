const Loading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-300 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 border-4 border-blue-200 border-t-transparent rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium">
                    
                </div>
            </div>
        </div>
    )
}

export default Loading