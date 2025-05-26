export default function CalendarPage() {
    return (
        <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Calendar Card */}
                <div className="bg-white rounded-xl shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.01]">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
                        Calendar
                    </h2>
                    {/* Calendar component will go here */}
                </div>
            </div>
        </div>
    );
}
