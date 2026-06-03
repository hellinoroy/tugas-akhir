import Cards from "./cards"
import { ClipboardDocumentListIcon, CpuChipIcon, ChartBarIcon } from '@heroicons/react/24/solid'

export default function HowItWorks() {
    return (
        <section className="flex flex-col justify-center items-center text-white bg-gray-900 py-10 gap-10">
            <h2 className="font-bold text-4xl">How It Works</h2>
            <div className="flex flex-col gap-14 lg:flex-row px-10">
                <Cards 
                    icon={ClipboardDocumentListIcon}
                    number={1}
                    heading="Input Data"
                    paragraph="Complete your lifestyle information, such as physical activity, sleep duration, stress levels, and more."
                />

                <Cards 
                    icon={CpuChipIcon}
                    number={2}
                    heading="Automated Analysis"
                    paragraph="The system analyzes the data using machine learning models to identify patterns that affect sleep quality."
                />

                <Cards 
                    icon={ChartBarIcon}
                    number={3}
                    heading="Get Results & Insights"
                    paragraph="View your sleep quality predictions along with the contributing factors and personalized recommendations."
                />
            </div>
            
        </section>





    )
    
}