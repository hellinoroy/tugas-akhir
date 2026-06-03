export default function Explanation() {
    return (
        <section className="text-white flex flex-row items-center w-full gap-5 md:gap-4 xl:gap-50 p-10 max-w-6xl mx-auto" id="explain">
            <div className="flex flex-col sm:w-1/2 gap-4">
                <h2 className="font-bold text-2xl md:text-4xl">What Is SleepWell ?</h2>
                <h5 className="text-justify text-lg md:text-xl">
                    Sleewell is a questionnaire-based platform designed to help you better understand the factors that may influence your sleep quality. By answering a series of questions about your daily habits, lifestyle, physical activity, stress levels, and sleep patterns, you can receive an analysis of your predicted sleep quality and the factors most closely associated with it.
                </h5>
            </div>

            <div className="sm:w-1/2 hidden sm:flex justify-center">
                <img 
                    src="/images/christopher-stites-unsplash-bedroom-lamp.jpg" 
                    alt="Bedroom Lamp"
                    className="rounded-4xl object-cover hidden sm:inline sm:h-[400px] lg:h-[600px] xl:h-[800px]" 
                />
            </div>
        </section>
    )
}