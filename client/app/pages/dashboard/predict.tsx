import { useState } from "react";
import { api } from "~/root";
import { useRouteLoaderData } from "react-router";

type Prediction = {
    prediction: number,
    probability: [number, number],
};

type FeedbackStatus = "none" | "correct" | "wrong" | "submitted";

export default function DashboardPrediction() {
    const {age, genderValue} = useRouteLoaderData("dashboard-root");
    
    const [prediction, setPrediction] = useState<Prediction>();
    const [status, setStatus] = useState<FeedbackStatus>("none");

    const [caffeine, setCaffeine] = useState(0);
    const [alcohol, setAlcohol] = useState(0);
    const [smoking, setSmoking] = useState(0);
    const [exercise, setExercise] = useState(0);

    const convertMlToOz = (mlValue: number) => {
        return Math.ceil(mlValue / 29.5735);
    };


    const onSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const payload = {
            'age': age,
            'gender': genderValue,
            'caffeine_consumption': caffeine,
            'alcohol_consumption' : convertMlToOz(alcohol),
            'smoking_status': smoking,
            'exercise_frequency': exercise
        }

        const response = await api.post("/ml/predict", payload);
        
        setPrediction(response.data);
    }

    const submitFeedback = async (e: React.MouseEvent<HTMLButtonElement>, status: "wrong" | "correct") => {
        e.preventDefault();
   
        let predicted;

        if (status == 'correct') {
            predicted = prediction!.prediction;
            console.log(predicted);
        } else if (status == 'wrong') {
            predicted = prediction!.prediction == 1 ? 0 : 1;
        }
 
        const payload = {
            'caffeine_consumption': caffeine,
            'alcohol_consumption' : convertMlToOz(alcohol),
            'smoking_status': smoking,
            'exercise_frequency': exercise,
            'prediction': predicted
        }

        const response = await api.post("/ml/feedback", payload);
        setStatus("submitted");
    };

    return (
        <div className="flex flex-row items-center justify-center h-full gap-10">
            <form 
                onSubmit={onSubmit} 
                className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100 space-y-6"
            >
                <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Lifestyle Sleep Quality Prediction</h2>
                <p className="text-sm text-gray-500 mt-1">Please fill out your daily habits below.</p>
                </div>

                <hr className="border-gray-100" />

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Caffeine Consumption
                    </label>
                    <input 
                        onChange={(e) => setCaffeine(parseInt(e.target.value))}
                        value={caffeine}
                        type="number" 
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Alcohol Consumption
                    </label>
                    <input 
                        onChange={(e) => setAlcohol(parseInt(e.target.value))}
                        value={alcohol}
                        type="number" 
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Smoking Habits
                    </label>
                    <select
                        onChange={(e) => setSmoking(parseInt(e.target.value))}
                        value={smoking}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                        <option value="">Select an option</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Exercise Frequency
                    </label>
                    <input 
                        onChange={(e) => setExercise(parseInt(e.target.value))}
                        value={exercise}
                        type="number" 
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <button 
                type="submit"
                className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition active:scale-[0.98]"
                >
                Submit Data
                </button>
            </form>

           
            {prediction ? (
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg min-h-[500px] w-[430px]">
                    <h2 className="mb-4 text-xl font-bold text-gray-800">
                        Prediction Result
                    </h2>

                    <div className="space-y-3 max-w-md">
                        <div>
                            <span className="font-semibold">Prediction:</span>{" "}
                                {prediction.prediction == 0
                                    ? "Good Sleep Quality"
                                    : "Poor Sleep Quality"}
                        </div>

                        <div>
                            <span className="font-semibold">Probability (Good Sleep Quality / Poor Sleep Quality) :</span>{" "}
                                {(prediction.probability[0] * 100).toFixed(2)}% /{" "}
                                {(prediction.probability[1] * 100).toFixed(2)}%
                        </div>

                        <hr />


                        {status == "none" ? (
                            <div>
                                <p className="mb-4 text-sm text-gray-600">
                                    Help us Improve ! Is this prediction accurate ?
                                </p>

                                <div className="my-5 w-full rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm">
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

                    
                                <div className="flex justify-between">
                                    <button
                                        type="submit"
                                        onClick={(e) => submitFeedback(e, "wrong")}
                                        className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                    >
                                        Prediction is Wrong
                                    </button>

                                    <button
                                        type="submit"
                                        onClick={(e) => submitFeedback(e, "correct")}
                                        className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                    >
                                        Prediction is Correct
                                    </button>
                                </div>
                              
                            </div>
                        ) : (
                            <>
                                <h3 className="font-semibold">Thank you!</h3>
                                <p>Your feedback has been recorded. It helps improve the model.</p>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex h-[500px] w-[430px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                        No Prediction Yet
                    </h3>

                    <p className="mt-2 text-sm text-gray-600">
                        Complete the form on the left, then click <strong>Submit</strong> to
                        generate your sleep quality prediction.
                    </p>

                </div>
            )}
           

        </div>
    );
}