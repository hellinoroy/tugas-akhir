import Cards from "./cards"
import { ClipboardDocumentListIcon, CpuChipIcon, ChartBarIcon } from '@heroicons/react/24/solid'

export default function HowItWorks() {
    return (
        <section 
            className="
                flex flex-col items-center my-10
                mx-2 sm:mx-20 
                xl:mx-30 2xl:mx-50 gap-5
            "
        >

            <h2 className="font-bold text-4xl">How It Works</h2>
            <div className="flex flex-col gap-5 lg:gap-14 lg:flex-row px-10">
                <Cards 
                    icon={ClipboardDocumentListIcon}
                    number={1}
                    heading="Input Data"
                    paragraph="Enter your sleep information, including bedtime, wake-up time, sleep duration, and other relevant details."
                />

                <Cards 
                    icon={CpuChipIcon}
                    number={2}
                    heading="Automated Analysis"
                    paragraph="Your sleep data is automatically analyzed to identify patterns, measure sleep quality, and evaluate your sleeping habits."
                />

                <Cards 
                    icon={ChartBarIcon}
                    number={3}
                    heading="Get Results & Insights"
                    paragraph="Receive clear results and personalized insights that help you understand your sleep and make better decisions for healthier routines."
                />
            </div>
            
        </section>





    )
    
}