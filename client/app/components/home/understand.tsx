import { useState } from "react";

export default function UnderstandSection() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section 
            className="
                flex flex-col items-center
                mx-2 sm:mx-20 
                xl:mx-30 2xl:mx-50 gap-5
            "
            id="learn-more"
        >
            <div className="flex flex-col gap-10">
                <h2 className="text-center font-bold text-4xl">Understand your sleep</h2>
                <p className="text-xl text-slate-600 text-justify">
                    Get a clearer picture of your sleep with simple, meaningful insights. Track your sleep duration, awakenings, sleep efficiency, and consistency over time to understand how well you’re resting and how your habits are changing.

                    Your weekly overview makes it easy to spot patterns at a glance whether you’re getting enough sleep, maintaining a consistent schedule, or noticing changes in your sleep quality. Instead of relying on how you feel each morning, use your data to understand what’s happening while you sleep.
                </p>
            </div>


            
            <img
                src="images/dashboard.png" 
                alt="dashboard" 
                className="shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setIsOpen(true)}
            />

            {isOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <div className="relative max-w-7xl max-h-[90vh]">
                        {/* Close Button */}
                        <button 
                            className="absolute -top-10 right-0 text-white text-2xl font-bold hover:text-gray-300"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </button>

                        <img
                            src="images/dashboard.png" 
                            alt="dashboard enlarged" 
                            className="max-h-[85vh] w-auto object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking the image itself
                        />
                    </div>
                </div>
            )}
        </section>
    );
}