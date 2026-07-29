export type Tracker = {
    id?: number,
    bedtime: string,
    wakeup:string,
    sleepDuration:number,
    sleepEfficiency: number,
    awakenings: number,
    timeInBed: number,
    isGoodSleep: boolean,
    created_at?: string,
    updated_at?: string,
};

export type TrackerAPI = {
    items: Tracker[],
    page: number,
    page_size: number,
    total:number,
}

type TrackerCardProp = {
    data: Tracker | undefined 
} 
// refresh button callback kalo rajin

export default function TrackerCard( { data } : TrackerCardProp) {
    if(!data) {
        return (
            <div className="flex h-[660px] w-[430px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                    No Today's Assesment Yet
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                    Complete the form Sleep Tracker Page, then click <strong>Submit</strong> to
                    generate your sleep quality assessment.
                </p>
            </div>
        );
    }

    return (
        <div className="w-[430px] my-5 rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm flex flex-col ">

            <div
                className={`rounded-xl border p-5 ${
                    data.isGoodSleep
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                }`}
            >
                <div className="flex items-center gap-4">
                    <div
                        className={`flex h-14 w-14 items-center justify-center rounded-full text-3xl ${
                            data.isGoodSleep
                                ? "bg-green-100"
                                : "bg-red-100"
                        }`}
                    >
                        {data.isGoodSleep ? "😊" : "😴"}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            Today's Assessment Result
                        </h3>

                        <p
                            className={`mt-1 font-bold ${
                                data.isGoodSleep
                                    ? "text-green-700"
                                    : "text-red-700"
                            }`}
                        >
                            {data.isGoodSleep ? "Good Sleep Quality" : "Poor Sleep Quality"}
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                            {data.isGoodSleep
                                ? "Your sleep meets the recommended criteria."
                                : "Your sleep quality needs improvement."}
                        </p>
                    </div>
                </div>
            </div>

            <p className="mt-6 font-medium text-gray-800">
                Your Sleep Result
            </p>

            <div className="mt-3 text-sm text-gray-600">
                <div>
                    <p className="font-medium text-gray-700">
                        Recorded Values
                    </p>

                    <ul className="mt-1 list-disc space-y-1 pl-5">
                        <li>
                          <strong>{Math.floor(data.sleepDuration)}</strong> hours <strong>{Math.round((data.sleepDuration % 1) * 60)}</strong> minutes
                        </li>
                        <li>
                            Awakenings: <strong>{data.awakenings}</strong>
                        </li>
                        <li>
                            Sleep efficiency: <strong>{(data.sleepEfficiency * 100).toFixed(2)}%</strong>
                        </li>
                    </ul>
                </div>
            </div>

            <hr className="my-6 border-gray-200" />


            <p className="font-medium text-gray-800">
                Good Sleep Quality Criteria
            </p>

            <div className="mt-3 space-y-4 text-sm text-gray-600">

                <div>
                    <p className="font-medium text-gray-700">
                        Adults (18–64 years)
                    </p>

                    <ul className="mt-1 list-disc space-y-1 pl-5">
                        <li>Sleep duration: <strong>7–9 hours</strong></li>
                        <li>Awakenings: <strong>1 or fewer</strong></li>
                        <li>Sleep efficiency: <strong>87.5% or higher</strong></li>
                    </ul>
                </div>

                <div>
                    <p className="font-medium text-gray-700">
                        Older Adults (65+ years)
                    </p>

                    <ul className="mt-1 list-disc space-y-1 pl-5">
                        <li>Sleep duration: <strong>7–8 hours</strong></li>
                        <li>Awakenings: <strong>2 or fewer</strong></li>
                        <li>Sleep efficiency: <strong>87.5% or higher</strong></li>
                    </ul>
                </div>

            </div>

            <div className="mt-4 border-t border-gray-200 pt-3">
                <p className="text-xs text-gray-500">
                    Sleep Efficiency = (Time Asleep ÷ Time in Bed) × 100
                </p>
            </div>
            
        </div>
    );
}